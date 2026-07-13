// Pure admin-target resolution behind scripts/check-d1-job-sources.mjs: reading
// the jobs admin token and base URL from flags/environment. Split out - with the
// environment injected - so they can be unit-tested without the admin fetch layer
// or a live process environment.

/** Resolve the jobs admin API token from the accepted environment variables. */
export function getToken(env = process.env) {
  return String(
    env.ADMIN_API_TOKEN ||
      env.JOBS_ADMIN_API_TOKEN ||
      env.LEADS_ADMIN_TOKEN ||
      env.ADMIN_LEADS_TOKEN ||
      "",
  ).trim();
}

/**
 * Resolve the admin base URL from --base-url or the accepted environment
 * variables, stripping a trailing slash. Throws when none is set.
 */
export function getBaseUrl(args, env = process.env) {
  const baseUrl = String(
    args["base-url"] ||
      env.HEYCLAUDE_ADMIN_BASE_URL ||
      env.HEYCLAUDE_BASE_URL ||
      "",
  ).trim();
  if (!baseUrl) {
    throw new Error("Missing --base-url or HEYCLAUDE_ADMIN_BASE_URL.");
  }
  return baseUrl.replace(/\/$/, "");
}
