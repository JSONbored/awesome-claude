const PACKAGE_NAME_PATTERN =
  /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/i;
const EXACT_SEMVER_PATTERN =
  /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

function packageVersionSeparatorIndex(value) {
  if (value.startsWith("@")) {
    const slashIndex = value.indexOf("/");
    if (slashIndex < 0) return -1;
    return value.indexOf("@", slashIndex + 1);
  }
  return value.lastIndexOf("@");
}

/**
 * Parse an npm-style package spec into name, scope, and version parts.
 *
 * @param {unknown} spec
 * @returns {{ name: string, scope: string, version: string } | null}
 */
export function parsePackageSpec(spec) {
  const value = String(spec ?? "").trim();
  if (!value || /\s/.test(value) || value.startsWith("-")) return null;

  const separatorIndex = packageVersionSeparatorIndex(value);
  const name = separatorIndex > 0 ? value.slice(0, separatorIndex) : value;
  const version =
    separatorIndex > 0 ? value.slice(separatorIndex + 1).trim() : "";

  if (!PACKAGE_NAME_PATTERN.test(name)) return null;
  const scope = name.startsWith("@") ? name.slice(0, name.indexOf("/")) : "";
  return { name, scope, version };
}

/**
 * Return true only for exact semver pins such as name@1.2.3 or
 * @scope/name@1.2.3-beta.1.
 *
 * @param {unknown} spec
 * @returns {boolean}
 */
export function isPinnedPackageSpec(spec) {
  const parsed = parsePackageSpec(spec);
  return Boolean(parsed?.version && EXACT_SEMVER_PATTERN.test(parsed.version));
}
