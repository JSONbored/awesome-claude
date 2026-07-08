// Pure parser for a github.com repo URL into { owner, repo }, split out of the
// github-stats route so the host guard and path handling can be unit-tested.

/**
 * Parse a github.com URL to its { owner, repo } (trailing ".git" stripped), or
 * null when the host is not github.com, the path lacks owner/repo, or the value
 * is not a valid URL.
 */
export function parseRepo(url: string): { owner: string; repo: string } | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com") return null;
    const [owner, repo] = parsed.pathname.split("/").filter(Boolean);
    if (!owner || !repo) return null;
    return { owner, repo: repo.replace(/\.git$/, "") };
  } catch {
    return null;
  }
}
