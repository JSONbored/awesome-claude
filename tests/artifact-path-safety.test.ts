import { describe, expect, it } from "vitest";

import { buildRegistryArtifactSet } from "@heyclaude/registry";
import { validateEntry } from "@heyclaude/registry/content-schema";

describe("artifact path safety", () => {
  it("rejects content slugs with path separators during content validation", () => {
    const validation = validateEntry("rules", {
      title: "Unsafe Rule",
      slug: "../../outside-artifact",
      category: "rules",
      description: "Rule with an unsafe slug.",
    });

    expect(validation.semanticErrors).toContain(
      "slug must contain only lowercase letters, numbers, and single hyphens",
    );
  });

  it("refuses to build registry artifacts for unsafe entry slugs", () => {
    expect(() =>
      buildRegistryArtifactSet([
        {
          category: "rules",
          slug: "../../outside-artifact",
          title: "Unsafe Rule",
          description: "Rule with an unsafe slug.",
          tags: [],
          keywords: [],
        },
      ]),
    ).toThrow(/Invalid content slug for artifact path/);
  });
});
