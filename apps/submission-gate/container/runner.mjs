import {
  createHash,
  createHmac,
  timingSafeEqual as cryptoTimingSafeEqual,
} from "node:crypto";
import { createServer } from "node:http";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";

const PORT = Number(process.env.PORT || 8080);
const VALIDATION_CHECKS = Object.freeze({
  strictContent: {
    label: "pnpm validate:content:strict",
    command: "pnpm",
    args: ["validate:content:strict"],
  },
  registryArtifacts: {
    label: "pnpm test:registry-artifacts",
    command: "pnpm",
    args: ["test:registry-artifacts"],
  },
  openapi: {
    label: "pnpm validate:openapi",
    command: "pnpm",
    args: ["validate:openapi"],
  },
  build: {
    label: "pnpm build",
    command: "pnpm",
    args: ["build"],
  },
  gitCheck: {
    label: "git diff --check",
    command: "git",
    args: ["diff", "--check"],
  },
});
const DEFAULT_VALIDATION_CHECKS = Object.freeze([
  "strictContent",
  "registryArtifacts",
  "openapi",
  "build",
  "gitCheck",
]);
const GITHUB_USER_AGENT = "heyclaude-submission-gate-import-runner";
const MAINTAINER_GENERATION_COMMANDS = Object.freeze([
  {
    label: "pnpm --filter web run prebuild",
    command: "pnpm",
    args: ["--filter", "web", "run", "prebuild"],
  },
  {
    label: "pnpm generate:readme",
    command: "pnpm",
    args: ["generate:readme"],
  },
]);
const GITHUB_REPO_PATTERN =
  /^[A-Za-z0-9][A-Za-z0-9-]{0,99}\/[A-Za-z0-9][A-Za-z0-9._-]{0,99}$/;
const GIT_REF_PATTERN =
  /^(?!-)(?!.*\.\.)(?!.*\/\/)(?!.*@\{)[A-Za-z0-9._/-]{1,200}$/;
const UNSAFE_GIT_REF_CHARS = /[*[\]~^:\\]/;
const DEFAULT_ALLOWED_IMPORT_REPOS = ["JSONbored/awesome-claude"];
const DEFAULT_COMMAND_TIMEOUT_MS = 15 * 60 * 1000;
const DEFAULT_GITHUB_TIMEOUT_MS = 15_000;
const MAX_CAPTURE_CHARS = 1024 * 1024;
const RUNTIME_DIRS = Object.freeze(
  [
    process.env.HOME,
    process.env.COREPACK_HOME,
    process.env.PNPM_HOME,
    process.env.PNPM_STORE_PATH,
    process.env.XDG_CACHE_HOME,
  ].filter(Boolean),
);
const ALLOWED_IMPORT_PATH_PREFIXES = ["content/"];
const BLOCKED_IMPORT_PATHS = new Set([
  ".npmrc",
  ".yarnrc",
  ".yarnrc.yml",
  "bun.lock",
  "bun.lockb",
  "deno.lock",
  "npm-shrinkwrap.json",
  "package-lock.json",
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "yarn.lock",
]);
const activeImportJobs = new Set();

class PayloadTooLargeError extends Error {
  constructor() {
    super("Payload too large.");
    this.name = "PayloadTooLargeError";
    this.code = "PAYLOAD_TOO_LARGE";
  }
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    let bytesReceived = 0;
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      bytesReceived += Buffer.byteLength(chunk, "utf8");
      if (bytesReceived > 1024 * 1024) {
        reject(new PayloadTooLargeError());
        request.destroy();
        return;
      }
      body += chunk;
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function timingSafeEqual(left, right) {
  const leftDigest = createHash("sha256").update(left).digest();
  const rightDigest = createHash("sha256").update(right).digest();
  return cryptoTimingSafeEqual(leftDigest, rightDigest);
}

function verifySignature(secret, payload, signature) {
  if (!secret || !signature?.startsWith("sha256=")) return false;
  const expected = `sha256=${createHmac("sha256", secret).update(payload).digest("hex")}`;
  return timingSafeEqual(expected, signature);
}

export function safeCallbackUrl(value) {
  const url = new URL(String(value || ""));
  if (
    url.protocol !== "https:" ||
    !["submission-gate.heyclau.de", "submission-gate-dev.heyclau.de"].includes(
      url.hostname,
    ) ||
    url.pathname !== "/internal/import-complete"
  ) {
    throw new Error("Import callback URL is not allowed.");
  }
  return url.toString();
}

export function redactSensitiveOutput(value) {
  return String(value || "").replace(
    /x-access-token:[^@\s]+@/g,
    "x-access-token:<redacted>@",
  );
}

export function maintainerGenerationCommandLabels() {
  return MAINTAINER_GENERATION_COMMANDS.map((step) => step.label);
}

export function githubUserAgent() {
  return GITHUB_USER_AGENT;
}

export function safeGitHubRepo(value) {
  const repo = String(value || "").trim();
  const [, name = ""] = repo.split("/");
  if (
    !GITHUB_REPO_PATTERN.test(repo) ||
    name.endsWith(".git") ||
    /(^[._-]|[._-]$)/.test(name)
  ) {
    throw new Error("Import job has an invalid GitHub repository.");
  }
  return repo;
}

function allowedImportRepos() {
  const configured = String(process.env.ALLOWED_IMPORT_REPOS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return new Set(configured.length ? configured : DEFAULT_ALLOWED_IMPORT_REPOS);
}

export function assertAllowedImportRepo(
  repo,
  allowedRepos = allowedImportRepos(),
) {
  if (!allowedRepos.has(repo)) {
    throw new Error("Import job targets an unauthorized repository.");
  }
  return repo;
}

export function safeGitRef(value, name) {
  const ref = String(value || "").trim();
  if (
    !GIT_REF_PATTERN.test(ref) ||
    UNSAFE_GIT_REF_CHARS.test(ref) ||
    ref.startsWith(".") ||
    ref.endsWith("/") ||
    ref.endsWith(".lock")
  ) {
    throw new Error(`Import job has an invalid ${name}.`);
  }
  return ref;
}

export function resolveValidationChecks(value) {
  const requested =
    Array.isArray(value) && value.length ? value : DEFAULT_VALIDATION_CHECKS;
  return requested.map((check) => {
    const key = String(check || "").trim();
    if (!Object.hasOwn(VALIDATION_CHECKS, key)) {
      throw new Error(`Unsupported validation check: ${key || "empty"}`);
    }
    return key;
  });
}

function appendCappedOutput(current, chunk) {
  const next = current + String(chunk);
  if (next.length <= MAX_CAPTURE_CHARS) return next;
  const marker = `[output truncated to last ${MAX_CAPTURE_CHARS} chars]\n`;
  const raw = next.startsWith(marker) ? next.slice(marker.length) : next;
  return `${marker}${raw.slice(-MAX_CAPTURE_CHARS)}`;
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const { timeoutMs = DEFAULT_COMMAND_TIMEOUT_MS, ...spawnOptions } = options;
    const child = spawn(command, args, {
      ...spawnOptions,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    let settled = false;
    const finish = (callback, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      callback(value);
    };
    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      finish(
        reject,
        new Error(
          `${command} timed out after ${timeoutMs}ms: ${redactSensitiveOutput(
            stderr || stdout,
          )}`,
        ),
      );
    }, timeoutMs);
    child.stdout.on("data", (chunk) => {
      stdout = appendCappedOutput(stdout, chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr = appendCappedOutput(stderr, chunk);
    });
    child.on("error", (error) => {
      finish(
        reject,
        new Error(
          `${command} failed to start: ${redactSensitiveOutput(
            error?.message || String(error),
          )}`,
        ),
      );
    });
    child.on("close", (code) => {
      if (code === 0) finish(resolve, { stdout, stderr });
      else {
        finish(
          reject,
          new Error(
            `${command} failed: ${redactSensitiveOutput(stderr || stdout)}`,
          ),
        );
      }
    });
  });
}

async function runValidationCheck(check, cwd) {
  const validation = VALIDATION_CHECKS[check];
  if (!validation) throw new Error(`Unsupported validation check: ${check}`);
  return run(validation.command, validation.args, { cwd });
}

async function ensureRuntimeDirs() {
  for (const dir of RUNTIME_DIRS) {
    await mkdir(dir, { recursive: true });
  }
}

async function runMaintainerGeneration(cwd) {
  for (const step of MAINTAINER_GENERATION_COMMANDS) {
    await run(step.command, step.args, { cwd });
  }
}

export function safeImportPath(repoDir, filePath) {
  const relativePath = path.normalize(
    String(filePath || "").replace(/\\+/g, "/"),
  );
  const parts = relativePath.split(path.sep).filter(Boolean);
  if (
    !parts.length ||
    path.isAbsolute(relativePath) ||
    parts.includes("..") ||
    parts.includes(".git")
  ) {
    throw new Error("Invalid import path.");
  }
  const absolutePath = path.resolve(repoDir, relativePath);
  if (!absolutePath.startsWith(`${repoDir}${path.sep}`)) {
    throw new Error("Invalid import path.");
  }
  return absolutePath;
}

export function assertSafeImportWrite(filePath) {
  const relativePath = path.normalize(
    String(filePath || "").replace(/\\+/g, "/"),
  );
  const normalized = relativePath.split(path.sep).filter(Boolean).join("/");
  const basename = path.posix.basename(normalized);
  if (
    !ALLOWED_IMPORT_PATH_PREFIXES.some((prefix) =>
      normalized.startsWith(prefix),
    )
  ) {
    throw new Error("Import job can only write source content files.");
  }
  if (
    BLOCKED_IMPORT_PATHS.has(normalized) ||
    BLOCKED_IMPORT_PATHS.has(basename)
  ) {
    throw new Error(
      "Import job cannot modify package manager or workspace files.",
    );
  }
  return normalized;
}

export function importContentPaths(files) {
  if (!Array.isArray(files)) return [];
  return [
    ...new Set(
      files
        .map((file) => (file?.path ? assertSafeImportWrite(file.path) : ""))
        .filter(Boolean),
    ),
  ].sort();
}

function gitAuthHeader(token) {
  return `Authorization: Basic ${Buffer.from(`x-access-token:${token}`).toString("base64")}`;
}

async function githubJson(url, token, init = {}) {
  const response = await fetch(url, {
    ...init,
    signal: init.signal || AbortSignal.timeout(DEFAULT_GITHUB_TIMEOUT_MS),
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      "user-agent": GITHUB_USER_AGENT,
      "x-github-api-version": "2022-11-28",
      ...init.headers,
    },
  });
  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }
  if (!response.ok) {
    throw new Error(
      `GitHub API ${response.status}: ${payload?.message || text}`,
    );
  }
  if (text && !payload) {
    throw new Error("GitHub API returned invalid JSON.");
  }
  return payload;
}

async function findExistingImportPr(owner, name, branchName, baseRef, token) {
  const head = `${owner}:${branchName}`;
  const prs = await githubJson(
    `https://api.github.com/repos/${owner}/${name}/pulls?state=open&head=${encodeURIComponent(head)}&base=${encodeURIComponent(baseRef)}`,
    token,
  );
  const pr = Array.isArray(prs) ? prs[0] : null;
  return pr?.html_url
    ? {
        ok: true,
        pullRequestUrl: pr.html_url,
        pullRequestNumber: pr.number,
      }
    : null;
}

async function handleImport(job) {
  await ensureRuntimeDirs();

  const {
    repo,
    baseRef = "main",
    branchName,
    title,
    body,
    files,
    githubToken,
    validationChecks,
    validationCommands,
  } = job;

  if (
    !repo ||
    !branchName ||
    !githubToken ||
    !Array.isArray(files) ||
    !files.length
  ) {
    throw new Error(
      "Import job requires repo, branchName, githubToken, and files.",
    );
  }

  const safeRepo = assertAllowedImportRepo(safeGitHubRepo(repo));
  const safeBaseRef = safeGitRef(baseRef, "baseRef");
  const safeBranchName = safeGitRef(branchName, "branchName");
  const safeValidationChecks = resolveValidationChecks(
    validationChecks ?? validationCommands,
  );
  const [owner, name] = safeRepo.split("/");
  const existingPr = await findExistingImportPr(
    owner,
    name,
    safeBranchName,
    safeBaseRef,
    githubToken,
  );
  if (existingPr) return existingPr;
  const workdir = await mkdtemp(path.join(tmpdir(), "heyclaude-import-"));
  try {
    await run(
      "git",
      [
        "clone",
        "--depth",
        "1",
        "--branch",
        safeBaseRef,
        "--",
        `https://github.com/${safeRepo}.git`,
        "repo",
      ],
      {
        cwd: workdir,
      },
    );
    const repoDir = path.join(workdir, "repo");
    await run("git", ["checkout", "-b", safeBranchName], { cwd: repoDir });

    const stagedImportPaths = importContentPaths(files);
    for (const file of files) {
      if (!file.path || typeof file.content !== "string") {
        throw new Error("Import file is missing path or content.");
      }
      const absolutePath = safeImportPath(repoDir, file.path);
      await mkdir(path.dirname(absolutePath), { recursive: true });
      await writeFile(absolutePath, file.content, "utf8");
    }

    await run("pnpm", ["install", "--frozen-lockfile", "--ignore-scripts"], {
      cwd: repoDir,
    });
    await runMaintainerGeneration(repoDir);
    for (const check of safeValidationChecks) {
      await runValidationCheck(check, repoDir);
    }

    await run("git", ["add", "--", ...new Set(stagedImportPaths)], {
      cwd: repoDir,
    });
    await run(
      "git",
      ["commit", "-m", title || "feat(content): import accepted submission"],
      {
        cwd: repoDir,
        env: {
          ...process.env,
          GIT_AUTHOR_NAME: "HeyClaude Submission Gate",
          GIT_AUTHOR_EMAIL: "actions@users.noreply.github.com",
          GIT_COMMITTER_NAME: "HeyClaude Submission Gate",
          GIT_COMMITTER_EMAIL: "actions@users.noreply.github.com",
        },
      },
    );
    // Imports are serialized per target by the Worker Durable Object lock; force updates keep the maintainer-owned branch idempotent across retries.
    await run(
      "git",
      [
        "-c",
        `http.https://github.com/.extraheader=${gitAuthHeader(githubToken)}`,
        "push",
        "--force",
        "origin",
        safeBranchName,
      ],
      {
        cwd: repoDir,
      },
    );

    const existingAfterPush = await findExistingImportPr(
      owner,
      name,
      safeBranchName,
      safeBaseRef,
      githubToken,
    );
    if (existingAfterPush) return existingAfterPush;

    const pr = await githubJson(
      `https://api.github.com/repos/${owner}/${name}/pulls`,
      githubToken,
      {
        method: "POST",
        body: JSON.stringify({
          title: title || "feat(content): import accepted submission",
          body:
            body || "Maintainer-owned import from the private submission gate.",
          head: safeBranchName,
          base: safeBaseRef,
          maintainer_can_modify: true,
        }),
      },
    );
    return {
      ok: true,
      pullRequestUrl: pr.html_url,
      pullRequestNumber: pr.number,
    };
  } finally {
    await rm(workdir, { recursive: true, force: true });
  }
}

async function postImportCallback(job, result) {
  if (!job.callbackUrl) return;
  const secret = process.env.INTERNAL_SHARED_SECRET || "";
  if (!secret) throw new Error("Import callback secret is not configured.");
  const callbackUrl = safeCallbackUrl(job.callbackUrl);
  const source = job.source || {};
  const ok = result?.ok !== false && Boolean(result?.pullRequestUrl);
  const body = JSON.stringify({
    ok,
    targetKey: job.targetKey,
    repo: source.repo || job.repo,
    number: source.number || job.number,
    baseRef: source.baseRef || job.baseRef,
    installationId: source.installationId,
    importPrUrl: result?.pullRequestUrl,
    summary: ok
      ? `Maintainer-owned import PR opened: ${result.pullRequestUrl}`
      : undefined,
    error: ok ? undefined : result?.error || "import_failed",
    message: ok ? undefined : redactSensitiveOutput(result?.message || ""),
  });
  const signature = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
  const response = await fetch(callbackUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-heyclaude-internal-signature": signature,
    },
    body,
  });
  if (!response.ok) {
    throw new Error(`Import callback returned ${response.status}.`);
  }
}

function importJobKey(job) {
  return `${job.repo || ""}:${job.branchName || ""}`;
}

function startAsyncImport(job) {
  const key = importJobKey(job);
  if (activeImportJobs.has(key)) {
    return {
      ok: true,
      accepted: true,
      alreadyRunning: true,
      message: "Import job is already running.",
    };
  }
  activeImportJobs.add(key);
  void (async () => {
    try {
      const result = await handleImport(job);
      await postImportCallback(job, result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "unknown import error";
      console.error(
        "submission async import failed",
        redactSensitiveOutput(message),
      );
      await postImportCallback(job, {
        ok: false,
        error: "import_failed",
        message: redactSensitiveOutput(message).slice(0, 4000),
      }).catch((callbackError) => {
        console.error(
          "submission import callback failed",
          redactSensitiveOutput(
            callbackError?.message || String(callbackError),
          ),
        );
      });
    } finally {
      activeImportJobs.delete(key);
    }
  })();
  return {
    ok: true,
    accepted: true,
    message: "Import job accepted by runner.",
  };
}

export function createImportServer() {
  return createServer(async (request, response) => {
    try {
      if (request.method === "GET" && request.url === "/health") {
        response.writeHead(200, { "content-type": "application/json" });
        response.end(JSON.stringify({ ok: true }));
        return;
      }
      if (request.method !== "POST" || request.url !== "/import") {
        response.writeHead(404, { "content-type": "application/json" });
        response.end(JSON.stringify({ ok: false, error: "not_found" }));
        return;
      }
      const body = await readBody(request);
      const secret = process.env.INTERNAL_SHARED_SECRET || "";
      if (
        !secret ||
        !verifySignature(
          secret,
          body,
          request.headers["x-heyclaude-internal-signature"],
        )
      ) {
        response.writeHead(401, { "content-type": "application/json" });
        response.end(JSON.stringify({ ok: false, error: "invalid_signature" }));
        return;
      }
      const job = JSON.parse(body);
      const result = job.callbackUrl
        ? startAsyncImport(job)
        : await handleImport(job);
      response.writeHead(job.callbackUrl ? 202 : 200, {
        "content-type": "application/json",
      });
      response.end(JSON.stringify(result));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "unknown import error";
      const status =
        error instanceof PayloadTooLargeError ||
        error?.code === "PAYLOAD_TOO_LARGE"
          ? 413
          : error instanceof SyntaxError
            ? 400
            : 500;
      if (status === 500) {
        console.error(
          "submission import failed",
          redactSensitiveOutput(message),
        );
      }
      response.writeHead(status, { "content-type": "application/json" });
      response.end(
        JSON.stringify({
          ok: false,
          error:
            status === 413
              ? "payload_too_large"
              : status === 400
                ? "invalid_json"
                : "import_failed",
          message: redactSensitiveOutput(message).slice(0, 4000),
        }),
      );
    }
  });
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  createImportServer().listen(PORT, "0.0.0.0");
}
