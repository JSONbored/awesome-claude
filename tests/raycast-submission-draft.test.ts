import { describe, expect, it } from "vitest";

import {
  normalizeSubmissionDraft,
  buildSubmissionDraftText,
  type SubmissionFormValues,
} from "../integrations/raycast/src/submission.js";

describe("normalizeSubmissionDraft", () => {
  it("trims fields, derives a slug from the title, and normalizes brand/tags", () => {
    const values: SubmissionFormValues = {
      category: "agents",
      title: "  My Cool Agent!  ",
      sourceUrl: "  https://x.example  ",
      brandDomain: "https://www.Brand.example",
      description: "  desc  ",
      tags: ["b", "a", "a"],
    };
    const draft = normalizeSubmissionDraft(values);
    expect(draft.title).toBe("My Cool Agent!");
    // No explicit slug -> derived from the title via slugify.
    expect(draft.slug).toBe("my-cool-agent");
    expect(draft.sourceUrl).toBe("https://x.example");
    // brandDomain runs through normalizeDomain (www-stripped, lowercased).
    expect(draft.brandDomain).toBe("brand.example");
    expect(draft.description).toBe("desc");
    // Tags are de-duplicated and sorted.
    expect(draft.tags).toEqual(["a", "b"]);
  });

  it("keeps an explicitly provided slug", () => {
    const values: SubmissionFormValues = {
      category: "hooks",
      title: "Title",
      slug: "custom-slug",
      sourceUrl: "https://y.example",
    };
    expect(normalizeSubmissionDraft(values).slug).toBe("custom-slug");
  });
});

describe("buildSubmissionDraftText", () => {
  it("renders labeled draft fields followed by the policy notes", () => {
    const draft = normalizeSubmissionDraft({
      category: "agents",
      title: "My Agent",
      sourceUrl: "https://x.example",
      tags: ["a", "b"],
    });
    const text = buildSubmissionDraftText(draft);
    expect(text).toContain("Category: agents");
    expect(text).toContain("Name: My Agent");
    expect(text).toContain("Slug: my-agent");
    expect(text).toContain("Source or docs URL: https://x.example");
    expect(text).toContain("Tags: a, b");
    // The policy notes are appended so the submitter sees the rules.
    expect(text).toContain("Policy notes:");
  });
});
