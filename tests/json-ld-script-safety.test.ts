import { describe, expect, it } from "vitest";
import { stringifyJsonLd } from "@/lib/json-ld";

describe("stringifyJsonLd", () => {
  it("escapes script-breakout characters while preserving JSON-LD values", () => {
    const payload = {
      "@context": "https://schema.org",
      name: "</script><script>globalThis.__xss = true</script>",
      description: "Tom & Jerry > Road Runner\u2028next line\u2029final line",
    };

    const serialized = stringifyJsonLd(payload);

    expect(serialized).not.toContain("<");
    expect(serialized).not.toContain(">");
    expect(serialized).not.toContain("&");
    expect(serialized).not.toContain("</script>");
    expect(serialized).toContain("\\u003c/script\\u003e");
    expect(serialized).toContain("\\u0026");
    expect(serialized).toContain("\\u2028");
    expect(serialized).toContain("\\u2029");
    expect(JSON.parse(serialized)).toEqual(payload);
  });
});
