import { describe, expect, it } from "vitest";

import { ogQuerySchema } from "../apps/web/src/lib/api/contracts-lib";
import { resolveOgQueryFields } from "../apps/web/src/lib/og-query-fields-lib";

const params = (init: Record<string, string>) => new URLSearchParams(init);

describe("resolveOgQueryFields", () => {
  it("uses provided params", () => {
    const fields = resolveOgQueryFields(
      params({
        title: "My Title",
        description: "My Desc",
        eyebrow: "Hub",
        accent: "#ff0000",
      }),
      "site desc",
    );
    expect(fields).toEqual({
      title: "My Title",
      description: "My Desc",
      eyebrow: "Hub",
      accent: "#ff0000",
    });
  });

  it("defaults title/eyebrow to HeyClaude and description to the site tagline", () => {
    const fields = resolveOgQueryFields(params({}), "The registry tagline");
    expect(fields.title).toBe("HeyClaude");
    expect(fields.eyebrow).toBe("HeyClaude");
    expect(fields.description).toBe("The registry tagline");
  });

  // Regression for #5555: present-but-empty (and whitespace-only) params must
  // not bypass the documented HeyClaude default the way `??` did.
  it.each([
    [{ title: "" }, "title"],
    [{ title: "   " }, "title"],
    [{ eyebrow: "" }, "eyebrow"],
    [{ eyebrow: "\t  " }, "eyebrow"],
  ] as const)(
    "falls back empty/whitespace %j to HeyClaude for %s",
    (init, field) => {
      const fields = resolveOgQueryFields(params(init), "site");
      expect(fields[field]).toBe("HeyClaude");
    },
  );

  it("prefers description over subtitle over the site description", () => {
    expect(
      resolveOgQueryFields(
        params({ subtitle: "Sub", description: "Desc" }),
        "site",
      ).description,
    ).toBe("Desc");
    expect(
      resolveOgQueryFields(params({ subtitle: "Sub" }), "site").description,
    ).toBe("Sub");
  });

  it("clamps whitespace and falls back to a safe accent for bad hex", () => {
    expect(
      resolveOgQueryFields(params({ title: "  a   b  " }), "s").title,
    ).toBe("a b");
    expect(
      resolveOgQueryFields(params({ accent: "red" }), "s").accent,
    ).not.toBe("red");
  });
});

describe("ogQuerySchema title default", () => {
  // Regression for #5555: Zod `.default` alone leaves present-but-empty title
  // as ""; the transform restores HeyClaude before the renderer.
  it.each([undefined, "", "   "] as const)(
    "resolves title %j to HeyClaude",
    (title) => {
      const parsed = ogQuerySchema.parse(title === undefined ? {} : { title });
      expect(parsed.title).toBe("HeyClaude");
    },
  );

  it("keeps a non-empty title unchanged", () => {
    expect(ogQuerySchema.parse({ title: "Custom Card" }).title).toBe(
      "Custom Card",
    );
  });
});
