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

  it("does not infer guide code examples as install commands", () => {
    const inferred = inferStructuredFields(
      {},
      [
        "## Launching an Audit Workflow",
        "",
        "Include the keyword to run a single audit task as a dynamic workflow:",
        "",
        "```text",
        "ultracode: audit every API endpoint under src/routes/ for missing auth checks",
        "```",
      ].join("\n"),
      "guides",
    );

    expect(inferred.installCommand).toBe("");
    expect(inferred.installable).toBe(false);
  });

  it("still infers single-line install commands for installable categories", () => {
    const inferred = inferStructuredFields(
      {},
      ["## Install", "", "```bash", "npx -y example-mcp", "```"].join(
        "\n",
      ),
      "mcp",
    );

    expect(inferred.installCommand).toBe("npx -y example-mcp");
    expect(inferred.installable).toBe(true);
  });
});
