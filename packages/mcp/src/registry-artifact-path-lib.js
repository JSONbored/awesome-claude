import path from "node:path";

export const SAFE_PATH_PART_PATTERN = /^[a-z0-9-]+$/;

export function isSafePathPart(value) {
  return SAFE_PATH_PART_PATTERN.test(String(value || ""));
}

export function safeRelativePath(relativePath) {
  const parts = String(relativePath || "").split("/");
  if (
    !parts.length ||
    parts.some((part) => !part || part === "." || part === "..")
  ) {
    throw new Error(`Unsafe registry artifact path: ${relativePath}`);
  }
  return parts.join(path.sep);
}
