/**
 * Pure safe frontmatter parsing helpers.
 *
 * Blocks executable JavaScript frontmatter engines and normalizes parsed output.
 * The public surface (`frontmatter.js` / `@heyclaude/registry/frontmatter`)
 * re-exports everything below so existing imports stay unchanged.
 */
import matter from "gray-matter";

export const UNSAFE_FRONTMATTER_LANGUAGE_ERROR =
  "Executable JavaScript frontmatter is not allowed in registry content";

export const SAFE_MATTER_OPTIONS = {
  engines: {
    javascript() {
      throw new Error(UNSAFE_FRONTMATTER_LANGUAGE_ERROR);
    },
  },
};

export function parseSafeFrontmatter(value, options = {}) {
  const content = String(value ?? "").replace(/^\uFEFF/, "");
  try {
    const parsed = matter(content, SAFE_MATTER_OPTIONS);
    return {
      data: parsed.data || {},
      content: parsed.content || "",
      excerpt: parsed.excerpt,
      language: parsed.language,
      matter: parsed.matter,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message === UNSAFE_FRONTMATTER_LANGUAGE_ERROR) throw error;
    if (options.fallbackOnError) {
      return { data: {}, content, error };
    }
    throw error;
  }
}
