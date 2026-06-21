import { describe, expect, it } from "vitest";

import { getTopFacts } from "@/lib/detail-assembly";
import type { ContentEntry } from "@heyclaude/registry";

function entry(overrides: Partial<ContentEntry>): ContentEntry {
  return {
    category: "agents",
    slug: "s",
    title: "t",
    description: "d",
    tags: [],
    keywords: [],
    body: "",
    sections: [],
    headings: [],
    codeBlocks: [],
    ...overrides,
  } as ContentEntry;
}

describe("getTopFacts", () => {
  it("includes only the fields that are present, in declaration order", () => {
    const facts = getTopFacts(
      entry({ author: "Me", dateAdded: "2026-01-01", difficulty: "easy" }),
    );
    expect(facts).toEqual([
      { label: "Author", value: "Me" },
      { label: "Added", value: "2026-01-01" },
      { label: "Difficulty", value: "easy" },
    ]);
  });

  it("returns an empty list when no fact fields are set", () => {
    expect(getTopFacts(entry({}))).toEqual([]);
  });

  it("surfaces skill-only facts for the skills category", () => {
    const facts = getTopFacts(
      entry({
        category: "skills",
        skillType: "capability-pack",
        verificationStatus: "validated",
      }),
    );
    expect(facts).toContainEqual({
      label: "Skill type",
      value: "capability-pack",
    });
    expect(facts).toContainEqual({
      label: "Verification",
      value: "validated",
    });
  });

  it("omits skill-only facts for non-skill categories even if the fields exist", () => {
    // skillType is meaningless outside the skills category, so it is dropped.
    const facts = getTopFacts(
      entry({ category: "agents", skillType: "capability-pack" }),
    );
    expect(facts.some((fact) => fact.label === "Skill type")).toBe(false);
  });
});
