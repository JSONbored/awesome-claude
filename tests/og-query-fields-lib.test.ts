import { describe, expect, it } from "vitest";

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
