// Pure argv builder behind scripts/sync-votes-to-d1.mjs: assembling the
// `wrangler d1 execute` argument list for a given run mode and SQL command. Split
// out - with the D1 binding injected - so the argument shaping can be
// unit-tested without spawning wrangler.

/**
 * Build the `wrangler d1 execute` args for `command` against `binding`, targeting
 * the remote or local database per `runMode` and appending `--json` when asked.
 */
export function wranglerArgs(runMode, command, binding, { json = false } = {}) {
  return [
    "d1",
    "execute",
    binding,
    runMode === "remote" ? "--remote" : "--local",
    "--command",
    command,
    ...(json ? ["--json"] : []),
  ];
}
