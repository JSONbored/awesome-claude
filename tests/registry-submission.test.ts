import { describe, expect, it } from "vitest";

import {
  CORE_CATEGORIES,
  normalizeHeading,
  validateSubmission,
} from "@heyclaude/registry/submission";

describe("registry submission re-export", () => {
  it("re-exports CORE_CATEGORIES from submission-lib", () => {
    expect(CORE_CATEGORIES).toContain("mcp");
    expect(CORE_CATEGORIES).toContain("skills");
  });

  it("re-exports normalizeHeading through the public registry surface", () => {
    expect(normalizeHeading("GitHub URL")).toBe("github-url");
  });

  it("re-exports validateSubmission through the public registry surface", () => {
    const result = validateSubmission({ body: "", title: "Random issue" });
    expect(result.skipped).toBe(true);
  });
});
