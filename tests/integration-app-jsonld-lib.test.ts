import { describe, expect, it } from "vitest";

import { integrationAppJsonLd } from "../apps/web/src/lib/integration-app-jsonld-lib";

const abs = (path: string) => `https://heyclau.de${path}`;
const URL = "https://heyclau.de/integrations/cursor";

describe("integrationAppJsonLd", () => {
  it("maps the core SoftwareApplication fields", () => {
    const ld = integrationAppJsonLd(
      { name: "Cursor", description: "AI editor" },
      URL,
      abs,
    ) as Record<string, unknown>;
    expect(ld["@type"]).toBe("SoftwareApplication");
    expect(ld.name).toBe("Cursor");
    expect(ld.description).toBe("AI editor");
    expect(ld.url).toBe(URL);
    expect(ld.applicationCategory).toBe("DeveloperApplication");
    expect(ld.publisher).toEqual({
      "@type": "Organization",
      name: "HeyClaude",
      url: "https://heyclau.de/",
    });
  });

  it("includes softwareVersion only when a version is present", () => {
    expect(
      "softwareVersion" in
        integrationAppJsonLd({ name: "X", description: "d" }, URL, abs),
    ).toBe(false);
    expect(
      integrationAppJsonLd(
        { name: "X", description: "d", version: "1.2.0" },
        URL,
        abs,
      ),
    ).toMatchObject({ softwareVersion: "1.2.0" });
  });
});
