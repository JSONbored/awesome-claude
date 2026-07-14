// Pure source-inspection helpers behind scripts/validate-raycast-feed.mjs:
// pulling a `const <name> = { ... }` object body out of a TS source string and
// checking whether that body defines a given key (bare or quoted). Used to verify
// the Raycast feed's category labels/icons cover every category. Split out so the
// regex logic can be unit-tested without reading the integration source files.

/** Extract the body of a `const <name> = { ... };` block from `source`, or "". */
export function objectBlock(source, name) {
  const match = source.match(
    new RegExp(`(?:const|export const)\\s+${name}[^=]*=\\s*{([\\s\\S]*?)\\n};`),
  );
  return match?.[1] ?? "";
}

/** Escape a string for literal use inside a RegExp. */
export function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** True when `block` defines `key` (as a bare or single/double-quoted key). */
export function objectDefinesKey(block, key) {
  const escapedKey = escapeRegExp(key);
  return new RegExp(
    `(^|\\n)\\s*(?:${escapedKey}|["']${escapedKey}["'])\\s*:`,
  ).test(block);
}
