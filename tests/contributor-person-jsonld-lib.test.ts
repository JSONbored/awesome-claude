import { describe, expect, it } from "vitest";

import { contributorPersonJsonLd } from "../apps/web/src/lib/contributor-person-jsonld-lib";

const URL = "https://heyclau.de/contributors/ada";

describe("contributorPersonJsonLd", () => {
  it("maps the core Person fields with an anchored @id", () => {
    const ld = contributorPersonJsonLd({}, URL, "Ada") as Record<
      string,
      unknown
    >;
    expect(ld["@type"]).toBe("Person");
    expect(ld["@id"]).toBe(`${URL}#person`);
    expect(ld.name).toBe("Ada");
    expect(ld.url).toBe(URL);
  });

  it("omits optional fields when absent", () => {
    const ld = contributorPersonJsonLd({}, URL, "Ada");
    expect("alternateName" in ld).toBe(false);
    expect("description" in ld).toBe(false);
    expect("sameAs" in ld).toBe(false);
  });

  it("includes alternateName, description, and sameAs when present", () => {
    const ld = contributorPersonJsonLd(
      { handle: "ada", bio: "Builds tools", github: "https://github.com/ada" },
      URL,
      "Ada",
    );
    expect(ld).toMatchObject({
      alternateName: "@ada",
      description: "Builds tools",
      sameAs: ["https://github.com/ada"],
    });
  });
});
