// Pure CLI-argument parsing behind scripts/submit-indexnow.mjs: turning the
// submit command's flags into an options object. Split out - with the
// environment injected - so the parsing can be unit-tested without the fetch /
// filesystem layers the script uses to gather and submit URLs.

import { DEFAULT_INDEXNOW_BASE_URL } from "./indexnow.mjs";

/**
 * Parse the submit-indexnow flags: --dry-run, --base-url <url>, repeated
 * --url <url>, and --urls-file <path>. The base URL defaults to
 * INDEXNOW_BASE_URL from the environment, then the built-in default.
 */
export function parseIndexNowArgs(argv, env = process.env) {
  const args = {
    baseUrl: env.INDEXNOW_BASE_URL || DEFAULT_INDEXNOW_BASE_URL,
    dryRun: false,
    urls: [],
    urlsFile: "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--dry-run") {
      args.dryRun = true;
      continue;
    }
    if (arg === "--base-url") {
      args.baseUrl = argv[++index] || args.baseUrl;
      continue;
    }
    if (arg === "--url") {
      args.urls.push(argv[++index] || "");
      continue;
    }
    if (arg === "--urls-file") {
      args.urlsFile = argv[++index] || "";
      continue;
    }
  }

  return args;
}
