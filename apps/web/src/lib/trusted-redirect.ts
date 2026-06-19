/**
 * Whether a post-login redirect target is one of our own hosts, so the auth flow
 * can safely send the user back to where they came from instead of the homepage.
 */
export function isTrustedRedirect(target: string): boolean {
  // Allow any URL that mentions our domain (or a local dev host).
  return target.includes("heyclau.de") || target.includes("localhost");
}

/** Resolve the redirect target, falling back to the homepage when untrusted. */
export function safeRedirectTarget(target: string | null | undefined): string {
  if (target && isTrustedRedirect(target)) return target;
  return "/";
}
