import { createHmac } from "node:crypto";
import { createServer } from "node:http";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const PORT = Number(process.env.PORT || 8080);

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("payload too large"));
        request.destroy();
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function timingSafeEqual(left, right) {
  const maxLength = Math.max(left.length, right.length);
  let diff = left.length === right.length ? 0 : 1;
  for (let index = 0; index < maxLength; index += 1) {
    diff |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return diff === 0;
}

function verifySignature(secret, payload, signature) {
  if (!secret || !signature?.startsWith("sha256=")) return false;
  const expected = `sha256=${createHmac("sha256", secret).update(payload).digest("hex")}`;
  return timingSafeEqual(expected, signature);
}

function redactSensitiveOutput(value) {
  return String(value || "").replace(
    /x-access-token:[^@\s]+@/g,
    "x-access-token:<redacted>@",
  );
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      ...options,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("close", (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${command} failed: ${redactSensitiveOutput(stderr || stdout)}`));
    });
  });
}

async function githubJson(url, token, init = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      "x-github-api-version": "2022-11-28",
      ...init.headers,
    },
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}: ${payload?.message || text}`);
  }
  return payload;
}

async function handleImport(job) {
  const {
    repo,
    baseRef = "main",
    branchName,
    title,
    body,
    files,
    githubToken,
    validationCommands = [
      "pnpm validate:content:strict",
      "pnpm test:registry-artifacts",
      "pnpm validate:openapi",
      "pnpm build",
      "git diff --check",
    ],
  } = job;

  if (!repo || !branchName || !githubToken || !Array.isArray(files) || !files.length) {
    throw new Error("Import job requires repo, branchName, githubToken, and files.");
  }

  const [owner, name] = repo.split("/");
  const workdir = await mkdtemp(path.join(tmpdir(), "heyclaude-import-"));
  try {
    const cloneUrl = `https://x-access-token:${githubToken}@github.com/${repo}.git`;
    await run("git", ["clone", "--depth", "1", "--branch", baseRef, cloneUrl, "repo"], {
      cwd: workdir,
    });
    const repoDir = path.join(workdir, "repo");
    await run("git", ["checkout", "-b", branchName], { cwd: repoDir });

    for (const file of files) {
      if (!file.path || typeof file.content !== "string") {
        throw new Error("Import file is missing path or content.");
      }
      const absolutePath = path.resolve(repoDir, file.path);
      if (!absolutePath.startsWith(`${repoDir}${path.sep}`)) {
        throw new Error("Invalid import path.");
      }
      await mkdir(path.dirname(absolutePath), { recursive: true });
      await writeFile(absolutePath, file.content, "utf8");
    }

    await run("corepack", ["enable"], { cwd: repoDir });
    await run("pnpm", ["install", "--frozen-lockfile"], { cwd: repoDir });
    for (const command of validationCommands) {
      const [cmd, ...args] = command.split(/\s+/);
      await run(cmd, args, { cwd: repoDir });
    }

    await run("git", ["add", "."], { cwd: repoDir });
    await run("git", ["commit", "-m", title || "feat(content): import accepted submission"], {
      cwd: repoDir,
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: "HeyClaude Submission Gate",
        GIT_AUTHOR_EMAIL: "actions@users.noreply.github.com",
        GIT_COMMITTER_NAME: "HeyClaude Submission Gate",
        GIT_COMMITTER_EMAIL: "actions@users.noreply.github.com",
      },
    });
    await run("git", ["push", "origin", branchName], { cwd: repoDir });

    const pr = await githubJson(`https://api.github.com/repos/${owner}/${name}/pulls`, githubToken, {
      method: "POST",
      body: JSON.stringify({
        title: title || "feat(content): import accepted submission",
        body: body || "Maintainer-owned import from the private submission gate.",
        head: branchName,
        base: baseRef,
        maintainer_can_modify: true,
      }),
    });
    return { ok: true, pullRequestUrl: pr.html_url, pullRequestNumber: pr.number };
  } finally {
    await rm(workdir, { recursive: true, force: true });
  }
}

const server = createServer(async (request, response) => {
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
    if (secret && !verifySignature(secret, body, request.headers["x-heyclaude-internal-signature"])) {
      response.writeHead(401, { "content-type": "application/json" });
      response.end(JSON.stringify({ ok: false, error: "invalid_signature" }));
      return;
    }
    const result = await handleImport(JSON.parse(body));
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(result));
  } catch (error) {
    response.writeHead(500, { "content-type": "application/json" });
    response.end(JSON.stringify({ ok: false, error: error.message }));
  }
});

server.listen(PORT, "0.0.0.0");
