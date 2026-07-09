import { describe, expect, it } from "vitest";

import { ogEntryCardFields } from "../apps/web/src/lib/og-entry-card-lib";

describe("ogEntryCardFields", () => {
  it("uses the entry's fields when present", () => {
    expect(
      ogEntryCardFields(
        {
          title: "My Agent",
          cardDescription: "Card copy",
          description: "Long copy",
          author: "Ada",
          category: "agents",
        },
        "slug",
        "cat",
      ),
    ).toEqual({
      title: "My Agent",
      description: "Card copy",
      author: "Ada",
      category: "agents",
    });
  });

  it("prefers description when cardDescription is missing", () => {
    expect(
      ogEntryCardFields({ description: "Long copy" }, "slug", "cat")
        .description,
    ).toBe("Long copy");
  });

  it("falls back to slug/category and default copy when the entry is absent", () => {
    expect(ogEntryCardFields(undefined, "my-slug", "agents")).toEqual({
      title: "my-slug",
      description: "Curated in the HeyClaude registry.",
      author: "HeyClaude",
      category: "agents",
    });
  });
});
