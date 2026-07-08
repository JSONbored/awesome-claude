// Pure allowlist validator for a GitHub OAuth "authorize" URL, split out of the
// submit route so it can be unit-tested. Only an https URL on an allowed GitHub
// host is accepted; anything else collapses to "" so the caller never follows an
// attacker-controlled redirect target.

const GITHUB_AUTH_HOSTS = new Set(["github.com"]);

/**
 * Return the normalized URL string only when `value` parses as an `https:` URL
 * whose hostname is an allowed GitHub host; otherwise return "". Never throws.
 */
export function safeGitHubAuthUrl(value: string): string {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !GITHUB_AUTH_HOSTS.has(url.hostname)) {
      return "";
    }
    return url.toString();
  } catch {
    return "";
  }
}
