import { describe, expect, it } from "vitest";

import {
  parseSafeFrontmatter,
  UNSAFE_FRONTMATTER_LANGUAGE_ERROR,
} from "@heyclaude/registry/frontmatter";

describe("registry frontmatter re-export", () => {
  it("re-exports parseSafeFrontmatter through the public registry surface", () => {
    const parsed = parseSafeFrontmatter("---\ntitle: Demo\n---\n\nBody.");
    expect(parsed.data.title).toBe("Demo");
    expect(parsed.content.trim()).toBe("Body.");
  });

  it("re-exports UNSAFE_FRONTMATTER_LANGUAGE_ERROR", () => {
    expect(UNSAFE_FRONTMATTER_LANGUAGE_ERROR).toContain("JavaScript");
  });
});
