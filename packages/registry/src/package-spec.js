// Parse and classify npm-style package specifiers ("name", "name@version",
// "@scope/name", "@scope/name@version"). Shared so the MCP config validator —
// and any future supply-chain check — agrees on what counts as a pinned version.

// An exact, pinned version is a full semver, optionally with a prerelease and/or
// build suffix (1.2.3, 1.2.3-beta.1, 1.2.3+build.5). Dist-tags ("latest"),
// ranges ("^1", "~1.2", "1.x", "*"), and bare names are NOT pinned.
const EXACT_SEMVER =
  /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

/**
 * Split a package specifier into its name, scope, and version.
 *
 * @param {unknown} spec e.g. "foo", "foo@1.2.3", "@scope/foo", "@scope/foo@1.2.3".
 * @returns {{ name: string, scope: string | null, version: string | null } | null}
 */
export function parsePackageSpec(spec) {
  const value = String(spec ?? "").trim();
  if (!value) return null;

  // A leading "@" marks a scope; drop it so the remaining "@" is the version
  // separator (scoped specs have at most one further "@").
  const scoped = value.startsWith("@");
  const body = scoped ? value.slice(1) : value;
  const versionAt = body.indexOf("@");

  const namePart = versionAt < 0 ? body : body.slice(0, versionAt);
  if (!namePart) return null;

  const version = versionAt < 0 ? null : body.slice(versionAt + 1) || null;
  const name = scoped ? `@${namePart}` : namePart;
  const scope = scoped ? `@${namePart.split("/")[0]}` : null;

  return { name, scope, version };
}

/**
 * Whether a package specifier pins an exact version. Bare names, dist-tags, and
 * ranges return false.
 *
 * @param {unknown} spec
 * @returns {boolean}
 */
export function isPinnedPackageSpec(spec) {
  const parsed = parsePackageSpec(spec);
  return Boolean(parsed?.version && EXACT_SEMVER.test(parsed.version));
}
