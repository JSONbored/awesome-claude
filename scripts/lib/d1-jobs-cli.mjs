// Pure argument/credential resolution behind scripts/manage-d1-jobs.mjs: parsing
// the CLI argv into a command + flag map, and resolving the admin token and base
// URL from flags/environment. Split out - with env injected - so they can be
// unit-tested without the network request layer or a live process environment.

/**
 * Parse `[command, --flag value, --bool]` argv into `{ command, ...flags }`.
 * A flag followed by a non-flag token takes that token as its value and
 * consumes it; a flag at the end or before another flag is set to "1".
 */
export function parseArgs(argv) {
  const [command = ""] = argv;
  const args = { command };
  for (let index = 1; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[index + 1];
    args[key] = next && !next.startsWith("--") ? next : "1";
    if (args[key] === next) index += 1;
  }
  return args;
}

/** Resolve the admin API token from the accepted environment variables. */
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
