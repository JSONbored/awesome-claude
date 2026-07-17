import { describe, expect, it } from "vitest";

import { buildContributorMdx } from "../apps/submission-gate/src/drafts";

describe("submission-gate drafts field fallback chains", () => {
  it("derives slug and title from the title field when slug and name are absent", () => {
    const mdx = buildContributorMdx({
      category: "skills",
      title: "Only A Title Here",
    });

    expect(mdx).toContain('slug: "only-a-title-here"');
    expect(mdx).toContain('title: "Only A Title Here"');
  });

  it("falls back to card_description for the description when description is absent", () => {
    const mdx = buildContributorMdx({
      category: "skills",
      title: "Card Fallback Skill",
      card_description: "Only the card copy was provided.",
    });

    expect(mdx).toContain('description: "Only the card copy was provided."');
  });
});

describe("submission-gate drafts default safety/privacy body copy", () => {
  it("omits the frontmatter list fields and defaults the body sections when notes are absent", () => {
    const mdx = buildContributorMdx({
      category: "skills",
      title: "No Notes Skill",
      description: "A skill with no safety or privacy notes supplied.",
    });

    expect(mdx).not.toContain("safetyNotes:");
    expect(mdx).not.toContain("privacyNotes:");

    const safetyHeadingIndex = mdx.indexOf("## Safety");
    const privacyHeadingIndex = mdx.indexOf("## Privacy");
    expect(safetyHeadingIndex).toBeGreaterThan(-1);
    expect(privacyHeadingIndex).toBeGreaterThan(safetyHeadingIndex);
    expect(mdx.slice(safetyHeadingIndex, privacyHeadingIndex)).toContain(
      "Maintainer review required.",
    );
    expect(mdx.slice(privacyHeadingIndex)).toContain(
      "Maintainer review required.",
    );
  });
});
