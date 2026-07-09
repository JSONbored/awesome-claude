import { describe, expect, it } from "vitest";

import { escapeXml } from "../apps/web/src/lib/xml-escape-lib";

describe("escapeXml", () => {
  it("escapes all five predefined XML entities", () => {
    expect(escapeXml(`&<>"'`)).toBe("&amp;&lt;&gt;&quot;&apos;");
  });

  it("escapes ampersands before other entities (no double-escaping)", () => {
    expect(escapeXml("a & b < c")).toBe("a &amp; b &lt; c");
  });

  it("leaves plain text unchanged", () => {
    expect(escapeXml("https://heyclau.de/browse")).toBe(
      "https://heyclau.de/browse",
    );
  });
});
