import { describe, expect, it } from "vitest";

import { inferStructuredFields } from "../packages/registry/src/content-schema.js";

describe("inferStructuredFields", () => {
  it("prefers explicit copySnippet frontmatter for rules entries", () => {
    const inferred = inferStructuredFields(
      {
        copySnippet: "Full rule payload\n\n## Rule Details",
        usageSnippet: "Short usage summary",
      },
      "## Usage\n\nShort public description.",
      "rules",
    );

    expect(inferred.copySnippet).toBe("Full rule payload\n\n## Rule Details");
  });

  it("falls back to the body as copySnippet for rules entries without frontmatter copy", () => {
    const inferred = inferStructuredFields(
      {
        usageSnippet: "Short usage summary",
      },
      "## Rule Body\n\nUse these rules.",
      "rules",
    );

    expect(inferred.copySnippet).toBe("## Rule Body\n\nUse these rules.");
  });
});
