// Pure CLI/payload helpers behind scripts/generate-weekly-brief.mjs: reading
// `--name=value` flag values and boolean flags out of an argv list, and pulling
// the entries array out of a registry artifact envelope. Split out - with argv
// injected - so they can be unit-tested without process.argv or the filesystem.

/** Value of a `--name=value` flag in argv, or `fallback` when absent. */
export function argValue(name, argv, fallback = "") {
  const prefix = `${name}=`;
  const match = argv.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

/** Whether the boolean flag `name` is present in argv. */
export function hasFlag(name, argv) {
  return argv.includes(name);
}

/** Return payload.entries, throwing a labelled error when it is not an array. */
export function envelopeEntries(payload, label) {
  if (!payload || !Array.isArray(payload.entries)) {
    throw new Error(`${label} must contain an entries array.`);
  }
  return payload.entries;
}
