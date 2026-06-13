import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

import {
  categorySpec,
  buildRegistryArtifactSet,
  parseAbbreviatedCount,
} from "@heyclaude/registry";
import {
  buildContentEntryFromMdx,
  DEFAULT_DIRECTORY_REPO_URL,
  parseGitHubRepo,
} from "@heyclaude/registry/content-builder";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const contentRoot = path.join(repoRoot, "content");
const generatedDir = path.join(repoRoot, "apps/web/src/generated");
const publicDataDir = path.join(repoRoot, "apps/web/public/data");
const entryDataDir = path.join(publicDataDir, "entries");
const raycastDetailDir = path.join(publicDataDir, "raycast");
const siteStatsFile = path.join(generatedDir, "site-stats.json");
const atlasRegistryFile = path.join(generatedDir, "atlas-registry.json");
const skillsDownloadsDir = path.join(
  repoRoot,
  "apps/web/public/downloads/skills",
);
const mcpDownloadsDir = path.join(repoRoot, "apps/web/public/downloads/mcp");
const ENABLE_GITHUB_REPO_STATS = process.env.ENABLE_GITHUB_REPO_STATS === "1";
const buildLockDir = path.join(repoRoot, ".build-content-index.lock");
const categories = categorySpec.categoryOrder.filter((category) =>
  fs.existsSync(path.join(contentRoot, category)),
);

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function withBuildLock(callback) {
  const staleAfterMs = 10 * 60 * 1000;
  const startedAt = Date.now();

  while (true) {
    try {
      fs.mkdirSync(buildLockDir);
      fs.writeFileSync(
        path.join(buildLockDir, "owner.json"),
        `${JSON.stringify({ pid: process.pid, createdAt: new Date().toISOString() }, null, 2)}\n`,
      );

      try {
        return await callback();
      } finally {
        fs.rmSync(buildLockDir, { recursive: true, force: true });
      }
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;

      let lockIsStale = false;
      try {
        const stats = fs.statSync(buildLockDir);
        lockIsStale = Date.now() - stats.mtimeMs > staleAfterMs;
      } catch {
        lockIsStale = true;
      }

      if (lockIsStale) {
        fs.rmSync(buildLockDir, { recursive: true, force: true });
        continue;
      }

      if (Date.now() - startedAt > staleAfterMs) {
        throw new Error("Timed out waiting for build-content-index lock");
      }

      await sleep(250);
    }
  }
}

async function fetchGitHubRepoStats(repo) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/${repo.owner}/${repo.repo}`,
    {
      headers,
    },
  );

  if (!response.ok) {
    const fallback = await fetchShieldsStars(repo);
    if (fallback !== null) {
      return {
        stars: fallback,
        forks: undefined,
        updatedAt: undefined,
      };
    }

    throw new Error(`GitHub API ${response.status} for ${repo.key}`);
  }

  const data = await response.json();
  return {
    stars:
      typeof data.stargazers_count === "number"
        ? data.stargazers_count
        : undefined,
    forks: typeof data.forks_count === "number" ? data.forks_count : undefined,
    updatedAt:
      typeof data.updated_at === "string" ? data.updated_at : undefined,
  };
}

async function fetchShieldsStars(repo) {
  try {
    const response = await fetch(
      `https://img.shields.io/github/stars/${repo.owner}/${repo.repo}.json`,
    );

    if (!response.ok) return null;
    const data = await response.json();
    const value = parseAbbreviatedCount(data.value ?? data.message);

    return value;
  } catch {
    return null;
  }
}

function sha256File(filePath) {
  const hash = crypto.createHash("sha256");
  hash.update(fs.readFileSync(filePath));
  return hash.digest("hex");
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function resetGeneratedJsonDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  ensureDir(dir);
}

function writeFileIfChanged(filePath, content) {
  if (fs.existsSync(filePath)) {
    const current = fs.readFileSync(filePath, "utf8");
    if (current === content) return false;
  }

  const tempFile = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tempFile, content);
  fs.renameSync(tempFile, filePath);
  return true;
}

function artifactOutputPath(artifactPath) {
  const dataRoot = path.resolve(publicDataDir);
  const outputPath = path.resolve(dataRoot, artifactPath);
  const dataRootPrefix = `${dataRoot}${path.sep}`;

  if (outputPath !== dataRoot && !outputPath.startsWith(dataRootPrefix)) {
    throw new Error(
      `Refusing to write artifact outside public data dir: ${artifactPath}`,
    );
  }

  return outputPath;
}

function writeJsonFile(filePath, value) {
  ensureDir(path.dirname(filePath));
  return writeFileIfChanged(filePath, `${JSON.stringify(value)}\n`);
}

async function writePrettierJsonFile(filePath, value) {
  ensureDir(path.dirname(filePath));
  const options = (await prettier.resolveConfig(filePath)) ?? {};
  const formatted = await prettier.format(
    `${JSON.stringify(value, null, 2)}\n`,
    {
      ...options,
      parser: "json",
    },
  );
  return writeFileIfChanged(filePath, formatted);
}

const ATLAS_CREDENTIAL_PLACEHOLDER_REPLACEMENTS = [
  [
    "postgresql://user:password@host:port/database",
    "PostgreSQL connection URI with user, password, host, port, and database",
  ],
  [
    "postgresql://user:password@localhost:5432/mydb",
    "PostgreSQL connection URI stored in POSTGRES_CONNECTION_STRING",
  ],
  [
    "redis://user:password@host:port/db",
    "Redis connection URI with user, password, host, port, and database",
  ],
  [
    "redis://:password@host:6379",
    "Redis connection URI with password authentication",
  ],
  [
    "redis://username:password@host:6379",
    "Redis connection URI with ACL username and password authentication",
  ],
];

function scrubAtlasCredentialPlaceholders(value) {
  if (typeof value === "string") {
    let scrubbed = value;
    for (const [
      placeholder,
      replacement,
    ] of ATLAS_CREDENTIAL_PLACEHOLDER_REPLACEMENTS) {
      scrubbed = scrubbed.split(placeholder).join(replacement);
    }
    return scrubbed;
  }

  if (Array.isArray(value)) {
    return value.map((item) => scrubAtlasCredentialPlaceholders(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        scrubAtlasCredentialPlaceholders(item),
      ]),
    );
  }

  return value;
}

function pickAtlasEntry(entry) {
  const repoStats =
    entry.repoUrl ||
    entry.githubStars != null ||
    entry.githubForks != null ||
    entry.repoUpdatedAt
      ? {
          repository: entry.repoUrl
            ? entry.repoUrl.replace(/^https:\/\/github\.com\//, "")
            : undefined,
          url: entry.repoUrl || undefined,
          stars: entry.githubStars,
          forks: entry.githubForks,
          updatedAt: entry.repoUpdatedAt,
          appliesTo: entry.repoUrl ? "listing_source_repo" : "none",
          label: "Source repo",
        }
      : undefined;

  return scrubAtlasCredentialPlaceholders({
    category: entry.category,
    slug: entry.slug,
    title: entry.title,
    description: entry.description,
    seoTitle: entry.seoTitle,
    seoDescription: entry.seoDescription,
    author: entry.author,
    submittedBy: entry.submittedBy,
    submittedByUrl: entry.submittedByUrl,
    submittedAt: entry.submittedAt,
    sourceSubmissionUrl: entry.sourceSubmissionUrl,
    importPrUrl: entry.importPrUrl,
    reviewedBy: entry.reviewedBy,
    reviewedAt: entry.reviewedAt,
    claimStatus: entry.claimStatus,
    authorProfileUrl: entry.authorProfileUrl,
    dateAdded: entry.dateAdded,
    contentUpdatedAt: entry.contentUpdatedAt,
    tags: entry.tags,
    keywords: entry.keywords,
    cardDescription: entry.cardDescription,
    installCommand: entry.installCommand,
    configSnippet: entry.configSnippet,
    usageSnippet: entry.usageSnippet,
    documentationUrl: entry.documentationUrl,
    githubUrl: entry.githubUrl,
    repoUrl: entry.repoUrl,
    brandName: entry.brandName,
    brandDomain: entry.brandDomain,
    brandIconUrl: entry.brandIconUrl,
    prerequisites: entry.prerequisites,
    safetyNotes: entry.safetyNotes,
    privacyNotes: entry.privacyNotes,
    downloadUrl: entry.downloadUrl,
    downloadSha256: entry.downloadSha256,
    packageVerified: entry.packageVerified,
    downloadTrust: entry.downloadTrust,
    githubStars: entry.githubStars,
    githubForks: entry.githubForks,
    repoUpdatedAt: entry.repoUpdatedAt,
    repoStats,
    trustSignals: entry.trustSignals
      ? {
          firstPartyEditorial: entry.trustSignals.firstPartyEditorial,
          sourceStatus: entry.trustSignals.sourceStatus,
          lastVerifiedAt: entry.trustSignals.lastVerifiedAt,
          platforms: entry.trustSignals.platforms,
          supportLevels: entry.trustSignals.supportLevels,
        }
      : undefined,
    platformCompatibility: entry.platformCompatibility,
    commandSyntax: entry.commandSyntax,
    argumentHint: entry.argumentHint,
    allowedTools: entry.allowedTools,
    scriptLanguage: entry.scriptLanguage,
    trigger: entry.trigger,
    items: entry.items,
    installationOrder: entry.installationOrder,
    estimatedSetupTime: entry.estimatedSetupTime,
    difficulty: entry.difficulty,
    skillType: entry.skillType,
    skillLevel: entry.skillLevel,
    verificationStatus: entry.verificationStatus,
    verifiedAt: entry.verifiedAt,
    retrievalSources: entry.retrievalSources,
    testedPlatforms: entry.testedPlatforms,
    pricingModel: entry.pricingModel,
    disclosure: entry.disclosure,
    applicationCategory: entry.applicationCategory,
    operatingSystem: entry.operatingSystem,
    readingTime: entry.readingTime,
    difficultyScore: entry.difficultyScore,
    hasPrerequisites: entry.hasPrerequisites,
    hasTroubleshooting: entry.hasTroubleshooting,
    hasBreakingChanges: entry.hasBreakingChanges,
  });
}

function writeTextFile(filePath, value) {
  ensureDir(path.dirname(filePath));
  return writeFileIfChanged(
    filePath,
    value.endsWith("\n") ? value : `${value}\n`,
  );
}

function loadGitContentUpdatedAt() {
  const values = new Map();

  try {
    const output = execFileSync(
      "git",
      ["log", "--format=@@heyclaude:%cI", "--name-only", "--", "content"],
      { cwd: repoRoot, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    );
    let commitUpdatedAt = null;

    for (const line of output.split("\n")) {
      if (line.startsWith("@@heyclaude:")) {
        commitUpdatedAt = line.slice("@@heyclaude:".length).trim() || null;
        continue;
      }

      const relativePath = line.trim();
      if (
        !commitUpdatedAt ||
        !relativePath.startsWith("content/") ||
        !relativePath.endsWith(".mdx") ||
        values.has(relativePath)
      ) {
        continue;
      }

      values.set(relativePath, commitUpdatedAt);
    }
  } catch {
    // Keep registry generation usable outside a Git checkout.
  }

  return values;
}

function loadExistingEntryRepoStats() {
  const values = new Map();
  if (!fs.existsSync(entryDataDir)) return values;

  for (const category of fs.readdirSync(entryDataDir)) {
    const categoryDir = path.join(entryDataDir, category);
    if (!fs.statSync(categoryDir).isDirectory()) continue;

    for (const fileName of fs.readdirSync(categoryDir)) {
      if (!fileName.endsWith(".json")) continue;

      try {
        const payload = JSON.parse(
          fs.readFileSync(path.join(categoryDir, fileName), "utf8"),
        );
        const entry = payload?.entry;
        if (!entry?.category || !entry?.slug) continue;
        values.set(`${entry.category}:${entry.slug}`, {
          stars:
            typeof entry.githubStars === "number"
              ? entry.githubStars
              : undefined,
          forks:
            typeof entry.githubForks === "number"
              ? entry.githubForks
              : undefined,
          updatedAt:
            typeof entry.repoUpdatedAt === "string"
              ? entry.repoUpdatedAt
              : undefined,
        });
      } catch {
        // Regeneration should not fail just because a stale artifact is invalid.
      }
    }
  }

  return values;
}

function loadExistingSiteStats() {
  if (!fs.existsSync(siteStatsFile)) return null;

  try {
    const payload = JSON.parse(fs.readFileSync(siteStatsFile, "utf8"));
    return {
      stars:
        typeof payload.githubStars === "number"
          ? payload.githubStars
          : undefined,
      forks:
        typeof payload.githubForks === "number"
          ? payload.githubForks
          : undefined,
      updatedAt:
        typeof payload.repoUpdatedAt === "string"
          ? payload.repoUpdatedAt
          : undefined,
    };
  } catch {
    return null;
  }
}

function copyFileIfChanged(sourcePath, destPath) {
  const source = fs.readFileSync(sourcePath);
  if (fs.existsSync(destPath)) {
    const current = fs.readFileSync(destPath);
    if (Buffer.compare(source, current) === 0) return false;
  }

  fs.writeFileSync(destPath, source);
  return true;
}

ensureDir(generatedDir);
ensureDir(publicDataDir);
ensureDir(skillsDownloadsDir);
ensureDir(mcpDownloadsDir);

for (const fileName of fs.readdirSync(path.join(contentRoot, "skills"))) {
  if (!fileName.endsWith(".zip")) continue;
  copyFileIfChanged(
    path.join(contentRoot, "skills", fileName),
    path.join(skillsDownloadsDir, fileName),
  );
}

for (const fileName of fs.readdirSync(path.join(contentRoot, "mcp"))) {
  if (!fileName.endsWith(".mcpb")) continue;
  copyFileIfChanged(
    path.join(contentRoot, "mcp", fileName),
    path.join(mcpDownloadsDir, fileName),
  );
}

async function main() {
  const entries = [];
  const repoStats = new Map();
  const reposToFetch = new Map();
  const directoryRepo = parseGitHubRepo(DEFAULT_DIRECTORY_REPO_URL);
  const gitContentUpdatedAt = loadGitContentUpdatedAt();
  const existingEntryRepoStats = ENABLE_GITHUB_REPO_STATS
    ? loadExistingEntryRepoStats()
    : new Map();
  const existingSiteStats = ENABLE_GITHUB_REPO_STATS
    ? loadExistingSiteStats()
    : null;

  if (directoryRepo) {
    reposToFetch.set(directoryRepo.key, directoryRepo);
  }

  for (const category of categories) {
    const categoryDir = path.join(contentRoot, category);
    const files = fs
      .readdirSync(categoryDir)
      .filter((fileName) => fileName.endsWith(".mdx"))
      .sort();

    for (const fileName of files) {
      const filePath = path.join(categoryDir, fileName);
      const source = fs.readFileSync(filePath, "utf8");
      const entry = buildContentEntryFromMdx({
        category,
        fileName,
        filePath,
        source,
        repoRoot,
        contentRoot,
        getLocalDownloadSha256(localDownloadPath) {
          return fs.existsSync(localDownloadPath)
            ? sha256File(localDownloadPath)
            : null;
        },
      });
      entry.contentUpdatedAt =
        entry.contentUpdatedAt ||
        gitContentUpdatedAt.get(path.relative(repoRoot, filePath)) ||
        entry.dateAdded;
      const githubRepo = parseGitHubRepo(entry.repoUrl);

      if (githubRepo) {
        reposToFetch.set(githubRepo.key, githubRepo);
      }

      entries.push(entry);
    }
  }

  if (ENABLE_GITHUB_REPO_STATS) {
    await Promise.all(
      [...reposToFetch.values()].map(async (repo) => {
        try {
          repoStats.set(repo.key, await fetchGitHubRepoStats(repo));
        } catch (error) {
          console.warn(
            `Could not fetch GitHub stats for ${repo.key}: ${error.message}`,
          );
        }
      }),
    );
  }

  for (const entry of entries) {
    const githubRepo = parseGitHubRepo(entry.repoUrl);
    if (!githubRepo) continue;

    const stats = repoStats.get(githubRepo.key);
    const existingStats = existingEntryRepoStats.get(
      `${entry.category}:${entry.slug}`,
    );
    if (!stats && !existingStats) continue;

    entry.githubStars = stats?.stars ?? existingStats?.stars ?? null;
    entry.githubForks = stats?.forks ?? existingStats?.forks ?? null;
    entry.repoUpdatedAt = stats?.updatedAt ?? existingStats?.updatedAt ?? null;
  }

  entries.sort((left, right) => left.title.localeCompare(right.title));

  resetGeneratedJsonDir(entryDataDir);
  fs.rmSync(path.join(publicDataDir, "llms"), { recursive: true, force: true });
  fs.rmSync(path.join(publicDataDir, "llms-full.txt"), { force: true });
  resetGeneratedJsonDir(raycastDetailDir);

  const artifactFiles = buildRegistryArtifactSet(entries, {
    siteUrl: "https://heyclau.de",
    siteName: "HeyClaude",
    siteDescription:
      "The Claude directory for agents, MCP servers, skills, commands, hooks, rules, guides, collections, and statuslines.",
  });
  const artifactResults = artifactFiles.map((file) => {
    const outputPath = artifactOutputPath(file.path);
    const wrote =
      file.type === "json"
        ? writeJsonFile(outputPath, file.value)
        : writeTextFile(outputPath, file.value);
    return { ...file, wrote, outputPath };
  });

  const directoryStats = directoryRepo
    ? repoStats.get(directoryRepo.key)
    : null;
  const siteStatsPayload = {
    directoryRepo: DEFAULT_DIRECTORY_REPO_URL,
    githubStars: directoryStats?.stars ?? existingSiteStats?.stars ?? null,
    githubForks: directoryStats?.forks ?? existingSiteStats?.forks ?? null,
    repoUpdatedAt:
      directoryStats?.updatedAt ?? existingSiteStats?.updatedAt ?? null,
  };
  const wroteSiteStats = writeFileIfChanged(
    siteStatsFile,
    `${JSON.stringify(siteStatsPayload, null, 2)}\n`,
  );
  const directoryIndexArtifact = artifactFiles.find(
    (file) => file.path === "directory-index.json",
  );
  const changelogArtifact = artifactFiles.find(
    (file) => file.path === "registry-changelog.json",
  );
  const atlasRegistryPayload = {
    schemaVersion: 1,
    generatedAt:
      directoryIndexArtifact?.value?.generatedAt ?? new Date().toISOString(),
    artifactContracts: artifactResults
      .filter((file) => !file.path.startsWith("entries/"))
      .filter((file) => !file.path.startsWith("llms/"))
      .filter((file) => !file.path.startsWith("raycast/"))
      .filter((file) => !file.path.startsWith("skill-adapters/"))
      .map((file) => ({
        path: `/data/${file.path}`,
        bytes: fs.statSync(file.outputPath).size,
        sha256: crypto
          .createHash("sha256")
          .update(fs.readFileSync(file.outputPath))
          .digest("hex"),
        builtAt:
          directoryIndexArtifact?.value?.generatedAt ??
          new Date().toISOString(),
      })),
    entries: entries.map(pickAtlasEntry),
    changelog: (changelogArtifact?.value?.entries ?? [])
      .slice(0, 25)
      .map((entry) => ({
        category: entry.category,
        slug: entry.slug,
        title: entry.title,
        dateAdded: entry.dateAdded,
        type: entry.type,
        artifactHash: entry.artifactHash,
      })),
  };
  const wroteAtlasRegistry = await writePrettierJsonFile(
    atlasRegistryFile,
    atlasRegistryPayload,
  );
  for (const result of artifactResults.filter(
    (file) => !file.path.includes("/"),
  )) {
    console.log(
      `${result.wrote ? "Wrote" : "Unchanged"} ${path.relative(repoRoot, result.outputPath)}`,
    );
  }
  console.log(
    `Wrote ${artifactResults.filter((file) => file.path.startsWith("entries/")).length} entry detail files to ${path.relative(repoRoot, entryDataDir)}`,
  );
  console.log(
    `Wrote ${artifactResults.filter((file) => file.path.startsWith("raycast/")).length} Raycast detail files to ${path.relative(repoRoot, raycastDetailDir)}`,
  );
  console.log(
    `${wroteSiteStats ? "Wrote" : "Unchanged"} ${path.relative(repoRoot, siteStatsFile)}`,
  );
  console.log(
    `${wroteAtlasRegistry ? "Wrote" : "Unchanged"} ${path.relative(repoRoot, atlasRegistryFile)}`,
  );
}

await withBuildLock(main);
