#!/usr/bin/env node
/**
 * SEO snippet audit — flags weak `seoTitle` / `seoDescription` on entry pages so
 * they can be improved by hand. GSC shows our bottleneck is CTR (not ranking),
 * and fully auto-writing snippets reads as duplicate/spammy, so this tool only
 * DETECTS and PRIORITIZES — it never writes content.
 *
 * Source: the generated registry (`apps/web/src/generated/atlas-registry.json`).
 * Run `pnpm --filter web run prebuild` first if the artifact is missing.
 *
 * Usage:
 *   pnpm audit:seo-snippets               # ranked markdown report
 *   pnpm audit:seo-snippets -- --json     # machine-readable JSON
 *   pnpm audit:seo-snippets -- --gsc gsc-pages.csv   # weight by GSC impressions
 *   pnpm audit:seo-snippets -- --limit 50
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..");

export const TITLE_MIN = 25;
export const TITLE_MAX = 60;
export const DESC_MIN = 70;
export const DESC_MAX = 160;

export function normalizeSnippet(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function entryPath(entry) {
  return `/entry/${entry.category}/${entry.slug}`;
}

/** Structural issues for a single entry's seoTitle/seoDescription. */
export function snippetIssues(entry) {
  const issues = [];
  const checkText = (field, value, sibling, min, max) => {
    const text = String(value ?? "").trim();
    if (!text) {
      issues.push({
        field,
        code: "missing",
        detail: `no ${field} (falls back to a generic snippet)`,
      });
      return;
    }
    if (text.length > max) {
      issues.push({
        field,
        code: "too-long",
        detail: `${text.length} chars (>${max}, truncated in SERP)`,
      });
    } else if (text.length < min) {
      issues.push({
        field,
        code: "too-short",
        detail: `${text.length} chars (<${min}, under-uses the snippet)`,
      });
    }
    if (normalizeSnippet(text) === normalizeSnippet(sibling)) {
      issues.push({
        field,
        code: "echoes-base",
        detail: `${field} just repeats the on-page ${field === "seoTitle" ? "title" : "description"}`,
      });
    }
  };
  checkText("seoTitle", entry.seoTitle, entry.title, TITLE_MIN, TITLE_MAX);
  checkText(
    "seoDescription",
    entry.seoDescription,
    entry.description,
    DESC_MIN,
    DESC_MAX,
  );
  return issues;
}

/**
 * Keys (`category/slug`) whose seoTitle or seoDescription is shared, verbatim,
 * by at least one other entry — i.e. templated/duplicate snippets.
 */
export function findDuplicateSnippets(entries) {
  const byTitle = new Map();
  const byDesc = new Map();
  for (const entry of entries) {
    const key = `${entry.category}/${entry.slug}`;
    const t = normalizeSnippet(entry.seoTitle);
    const d = normalizeSnippet(entry.seoDescription);
    if (t) byTitle.set(t, [...(byTitle.get(t) ?? []), key]);
    if (d) byDesc.set(d, [...(byDesc.get(d) ?? []), key]);
  }
  const dupTitleKeys = new Set();
  const dupDescKeys = new Set();
  for (const keys of byTitle.values())
    if (keys.length > 1) keys.forEach((k) => dupTitleKeys.add(k));
  for (const keys of byDesc.values())
    if (keys.length > 1) keys.forEach((k) => dupDescKeys.add(k));
  return { dupTitleKeys, dupDescKeys };
}

/** Parse a GSC "Pages" CSV export → Map<pathname, impressions>. Best-effort. */
export function parseGscImpressions(csv) {
  const lines = String(csv ?? "")
    .split(/\r?\n/)
    .filter(Boolean);
  if (lines.length < 2) return new Map();
  const splitRow = (line) =>
    line.split(",").map((c) => c.replace(/^"|"$/g, "").trim());
  const header = splitRow(lines[0]).map((h) => h.toLowerCase());
  const pageIdx = header.findIndex((h) => /page|url|landing/.test(h));
  const imprIdx = header.findIndex((h) => /impression/.test(h));
  if (pageIdx === -1 || imprIdx === -1) return new Map();
  const map = new Map();
  for (const line of lines.slice(1)) {
    const cols = splitRow(line);
    const raw = cols[pageIdx];
    const impressions =
      Number(String(cols[imprIdx] ?? "").replace(/[^0-9.]/g, "")) || 0;
    if (!raw) continue;
    let pathname = raw;
    try {
      pathname = new URL(raw).pathname;
    } catch {
      /* already a path */
    }
    pathname = pathname.replace(/\/+$/, "") || "/";
    map.set(pathname, (map.get(pathname) ?? 0) + impressions);
  }
  return map;
}

/** Audit all entries → findings sorted worst-first (by issue count, then impressions). */
export function auditEntries(entries, { gscImpressions = new Map() } = {}) {
  const { dupTitleKeys, dupDescKeys } = findDuplicateSnippets(entries);
  const findings = [];
  for (const entry of entries) {
    const key = `${entry.category}/${entry.slug}`;
    const issues = snippetIssues(entry);
    if (dupTitleKeys.has(key))
      issues.push({
        field: "seoTitle",
        code: "duplicate",
        detail: "seoTitle is shared verbatim with other entries",
      });
    if (dupDescKeys.has(key))
      issues.push({
        field: "seoDescription",
        code: "duplicate",
        detail: "seoDescription is shared verbatim with other entries",
      });
    if (issues.length === 0) continue;
    const pathname = entryPath(entry);
    findings.push({
      key,
      category: entry.category,
      slug: entry.slug,
      path: pathname,
      impressions: gscImpressions.get(pathname) ?? 0,
      issues,
    });
  }
  findings.sort(
    (a, b) =>
      b.issues.length - a.issues.length ||
      b.impressions - a.impressions ||
      a.key.localeCompare(b.key),
  );
  return findings;
}

function loadEntries() {
  const atlasPath = path.join(
    REPO_ROOT,
    "apps/web/src/generated/atlas-registry.json",
  );
  if (!fs.existsSync(atlasPath)) {
    throw new Error(
      "Missing apps/web/src/generated/atlas-registry.json — run `pnpm --filter web run prebuild` first.",
    );
  }
  return JSON.parse(fs.readFileSync(atlasPath, "utf8")).entries ?? [];
}

function parseArgs(argv) {
  const args = { json: false, limit: 50, gsc: "" };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--json") args.json = true;
    else if (a === "--limit") args.limit = Number(argv[++i]) || args.limit;
    else if (a === "--gsc") args.gsc = argv[++i] ?? "";
  }
  return args;
}

function renderMarkdown(findings, total) {
  const weighted = findings.some((f) => f.impressions > 0);
  const lines = [
    "# SEO snippet audit",
    "",
    `${findings.length} of ${total} entries have weak seoTitle/seoDescription${weighted ? " (ranked by GSC impressions)" : ""}.`,
    "Detection only — improve these by hand; do not auto-generate snippets.",
    "",
  ];
  for (const f of findings) {
    const impr = f.impressions ? ` · ${f.impressions} impressions` : "";
    lines.push(`## ${f.path}${impr}`);
    for (const issue of f.issues)
      lines.push(`- **${issue.field} / ${issue.code}** — ${issue.detail}`);
    lines.push("");
  }
  return lines.join("\n");
}

export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const entries = loadEntries();
  const gscImpressions = args.gsc
    ? parseGscImpressions(fs.readFileSync(args.gsc, "utf8"))
    : new Map();
  const all = auditEntries(entries, { gscImpressions });
  const findings = all.slice(0, args.limit);
  if (args.json) {
    console.log(
      JSON.stringify(
        { total: entries.length, flagged: all.length, findings },
        null,
        2,
      ),
    );
  } else {
    console.log(renderMarkdown(findings, entries.length));
    if (all.length > findings.length) {
      console.log(
        `… and ${all.length - findings.length} more (raise --limit to see them).`,
      );
    }
  }
  return all;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
