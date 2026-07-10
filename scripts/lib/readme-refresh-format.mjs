// Pure markdown/GitHub formatting helpers behind scripts/build-readme-refresh-body.mjs:
// escaping README text and normalizing/linking GitHub handles, repos and PRs.
// Split out so they can be unit-tested without git or filesystem access.

const githubUrlPrefix = "https://github.com/";
const githubLoginPattern =
  /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?(?:\[bot\])?$/;
const repositoryPattern = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

/** Escape a value for inline README markdown (and neutralize @/# mentions). */
export function escapeMarkdownText(value) {
  return String(value || "")
    .replace(/@/g, "&#64;")
    .replace(/(^|\s)#(?=\d)/g, "$1&#35;")
    .replace(/([\\`*_{}\[\]()#+\-.!|>])/g, "\\$1")
    .replace(/\s+/g, " ")
    .trim();
}

/** Normalize a GitHub handle/profile-URL to "@login", or "" if not a valid login. */
export function cleanGithubHandle(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  let handle = raw.replace(/^@/, "");
  try {
    const parsed = new URL(raw);
    if (parsed.hostname.toLowerCase() === "github.com") {
      handle = parsed.pathname.split("/").filter(Boolean)[0] ?? "";
    }
  } catch {
    // Treat non-URL values as GitHub logins.
  }

  return githubLoginPattern.test(handle) ? `@${handle}` : "";
}

/** Like cleanGithubHandle but without the leading "@". */
export function cleanGithubLogin(value) {
  return cleanGithubHandle(value).replace(/^@/, "");
}

/** Return an "owner/repo" string when it matches the repo shape, else "". */
export function cleanRepository(value) {
  const repository = String(value || "").trim();
  return repositoryPattern.test(repository) ? repository : "";
}

/** Markdown link to a GitHub profile ("[@login](url)"), or "" for an invalid login. */
export function formatGithubProfileLink(login) {
  const cleanLogin = cleanGithubLogin(login);
  if (!cleanLogin) return "";
  return `[@${cleanLogin}](${githubUrlPrefix}${cleanLogin})`;
}

/**
 * Markdown link to a pull request. Prefers a trusted github.com htmlUrl; else
 * derives the URL from a valid repository; else falls back to the bare "#<n>"
 * label. Returns "" when there is no usable PR number.
 */
export function formatPullRequestLink({ number, repository, htmlUrl }) {
  if (!number) return "";

  const numericNumber = Number(number);
  const label = Number.isFinite(numericNumber) ? `#${numericNumber}` : "";
  if (!label) return "";

  if (htmlUrl) {
    try {
      const parsed = new URL(htmlUrl);
      if (parsed.hostname.toLowerCase() === "github.com") {
        return `[${label}](${parsed.href})`;
      }
    } catch {
      // Fall back to repository-based links below.
    }
  }

  const cleanRepo = cleanRepository(repository);
  return cleanRepo
    ? `[${label}](${githubUrlPrefix}${cleanRepo}/pull/${numericNumber})`
    : label;
}
