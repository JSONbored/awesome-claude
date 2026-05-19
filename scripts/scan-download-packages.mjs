import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const repoRoot = process.cwd();
const contentRoot = path.join(repoRoot, "content");
const failures = [];
const warnings = [];
const missingScanners = new Set();
const requireScanners = process.argv.includes("--require-scanners");
const runExternalScanners =
  requireScanners || process.argv.includes("--external-scanners");

const MAX_ARCHIVE_BYTES = 10 * 1024 * 1024;
const MAX_UNCOMPRESSED_BYTES = 50 * 1024 * 1024;
const MAX_FILES = 500;
const MAX_COMPRESSION_RATIO = 30;

const nestedArchiveExtensions = new Set([
  ".zip",
  ".mcpb",
  ".tar",
  ".tgz",
  ".gz",
  ".rar",
  ".7z",
]);
const executableExtensions = new Set([
  ".app",
  ".appimage",
  ".dll",
  ".dmg",
  ".dylib",
  ".exe",
  ".msi",
  ".pkg",
  ".scr",
  ".so",
]);
const scriptExtensions = new Set([".bat", ".cmd", ".ps1", ".sh"]);
const dependencyFiles = new Set([
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "npm-shrinkwrap.json",
  "go.sum",
  "Cargo.lock",
  "Gemfile.lock",
  "requirements.txt",
  "poetry.lock",
  "Pipfile.lock",
]);

function rel(filePath) {
  return path.relative(repoRoot, filePath);
}

function commandExists(command) {
  const detector = process.platform === "win32" ? "where" : "which";
  const result = spawnSync(detector, [command], { stdio: "ignore" });
  return result.status === 0;
}

function unzipList(archivePath) {
  return execFileSync("unzip", ["-Z1", archivePath], { encoding: "utf8" })
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function unzipSummary(archivePath) {
  const output = execFileSync("unzip", ["-Z", "-l", archivePath], {
    encoding: "utf8",
  });
  const summary = output.trim().split("\n").at(-1) || "";
  const match = summary.match(
    /(\d+)\s+files?,\s+(\d+)\s+bytes uncompressed,\s+(\d+)\s+bytes compressed/i,
  );
  return match
    ? {
        fileCount: Number(match[1]),
        uncompressedBytes: Number(match[2]),
        compressedBytes: Number(match[3]),
      }
    : { fileCount: 0, uncompressedBytes: 0, compressedBytes: 0 };
}

function unzipLongList(archivePath) {
  return execFileSync("unzip", ["-Z", "-l", archivePath], { encoding: "utf8" })
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function archivePaths() {
  const paths = [];
  for (const category of ["skills", "mcp"]) {
    const dir = path.join(contentRoot, category);
    if (!fs.existsSync(dir)) continue;
    paths.push(...archivePathsInDirectory(dir));
  }
  return paths.sort();
}

function archivePathsInDirectory(dir) {
  const paths = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      paths.push(...archivePathsInDirectory(fullPath));
      continue;
    }
    if (entry.isFile() && /\.(zip|mcpb)$/i.test(entry.name)) {
      paths.push(fullPath);
    }
  }
  return paths;
}

function hasDependencyManifest(names) {
  return names.some((name) => dependencyFiles.has(path.basename(name)));
}

function runScanner(command, args, label, archivePath) {
  if (!commandExists(command)) {
    const message = `${label} is not installed; skipped optional scans`;
    if (requireScanners) failures.push(`${message} for ${rel(archivePath)}`);
    else missingScanners.add(message);
    return;
  }
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    const detail = [result.stdout, result.stderr].filter(Boolean).join("\n");
    failures.push(
      `${label} failed for ${rel(archivePath)}${detail ? `:\n${detail.trim()}` : ""}`,
    );
  }
}

function scanArchive(archivePath) {
  const relative = rel(archivePath);
  const stat = fs.statSync(archivePath);
  let unsafeForExtraction = false;
  if (stat.size > MAX_ARCHIVE_BYTES) {
    failures.push(`${relative}: archive exceeds 10MB scan limit`);
    unsafeForExtraction = true;
  }

  let names = [];
  let summary = {};
  let longListing = [];
  try {
    names = unzipList(archivePath);
    summary = unzipSummary(archivePath);
    longListing = unzipLongList(archivePath);
  } catch (error) {
    failures.push(`${relative}: cannot inspect archive (${error.message})`);
    return;
  }

  if (!names.length) failures.push(`${relative}: archive is empty`);
  if (names.length > MAX_FILES) {
    failures.push(`${relative}: archive contains more than ${MAX_FILES} files`);
    unsafeForExtraction = true;
  }
  if (summary.uncompressedBytes > MAX_UNCOMPRESSED_BYTES) {
    failures.push(`${relative}: uncompressed size exceeds 50MB scan limit`);
    unsafeForExtraction = true;
  }
  if (
    summary.compressedBytes > 0 &&
    summary.uncompressedBytes / summary.compressedBytes > MAX_COMPRESSION_RATIO
  ) {
    failures.push(
      `${relative}: compression ratio exceeds ${MAX_COMPRESSION_RATIO}:1`,
    );
    unsafeForExtraction = true;
  }

  for (const name of names) {
    if (name.startsWith("/") || name.includes("..") || name.includes("\\")) {
      failures.push(`${relative}: unsafe archive path (${name})`);
      unsafeForExtraction = true;
    }
    const ext = path.extname(name).toLowerCase();
    if (nestedArchiveExtensions.has(ext)) {
      failures.push(`${relative}: nested archive is not allowed (${name})`);
    }
    if (executableExtensions.has(ext)) {
      failures.push(
        `${relative}: executable package file is not allowed (${name})`,
      );
    }
    if (scriptExtensions.has(ext)) {
      warnings.push(
        `${relative}: script file requires source review (${name})`,
      );
    }
  }

  for (const line of longListing) {
    if (/^l[-rwx]/.test(line)) {
      failures.push(`${relative}: symbolic links are not allowed (${line})`);
      unsafeForExtraction = true;
    }
  }

  if (unsafeForExtraction) return;

  const tempRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), "heyclaude-package-scan-"),
  );
  try {
    execFileSync("unzip", ["-q", archivePath, "-d", tempRoot], {
      stdio: "ignore",
    });
    if (runExternalScanners) {
      runScanner(
        "clamscan",
        [
          "--recursive",
          "--infected",
          "--max-filesize=10M",
          "--max-scansize=50M",
          tempRoot,
        ],
        "ClamAV",
        archivePath,
      );
      runScanner(
        "trivy",
        [
          "fs",
          "--scanners",
          "vuln,secret,misconfig",
          "--exit-code",
          "1",
          tempRoot,
        ],
        "Trivy filesystem scan",
        archivePath,
      );
    }
    if (runExternalScanners && hasDependencyManifest(names)) {
      runScanner(
        "osv-scanner",
        ["--recursive", tempRoot],
        "OSV-Scanner",
        archivePath,
      );
    }
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

if (!commandExists("unzip")) {
  console.error("Package scan requires unzip.");
  process.exit(1);
}

const archives = archivePaths();
for (const archivePath of archives) scanArchive(archivePath);

if (warnings.length) {
  console.log(`Warnings (${warnings.length}):`);
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (missingScanners.size) {
  console.log("Optional scanners skipped:");
  for (const warning of missingScanners) console.log(`- ${warning}`);
}

if (failures.length) {
  console.error(`Failures (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Package artifact scan passed (${archives.length} archives).`);
