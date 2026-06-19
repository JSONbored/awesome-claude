import { describe, expect, it } from "vitest";
import { isJsonLdNode, parseJsonLd, stringifyJsonLd } from "@/lib/json-ld";

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

describe("parseJsonLd", () => {
  it("parses a valid JSON-LD object string", () => {
    const result = parseJsonLd('{"@context":"https://schema.org","@type":"Thing","name":"x"}');
    expect(result).toEqual({ "@context": "https://schema.org", "@type": "Thing", name: "x" });
  });

  it("returns null for missing, empty, or whitespace-only input", () => {
    expect(parseJsonLd(null)).toBeNull();
    expect(parseJsonLd(undefined)).toBeNull();
    expect(parseJsonLd("")).toBeNull();
    expect(parseJsonLd("   ")).toBeNull();
  });

  it("returns null for syntactically invalid JSON", () => {
    expect(parseJsonLd("{broken json}")).toBeNull();
    expect(parseJsonLd("undefined")).toBeNull();
  });

  it("returns null for valid JSON that is not a plain object", () => {
    expect(parseJsonLd('"a string"')).toBeNull();
    expect(parseJsonLd("42")).toBeNull();
    expect(parseJsonLd("[1,2,3]")).toBeNull();
    expect(parseJsonLd("null")).toBeNull();
  });

  it("round-trips with stringifyJsonLd", () => {
    const original = { "@context": "https://schema.org", "@type": "WebPage", name: "<title>" };
    const serialized = stringifyJsonLd(original);
    const parsed = parseJsonLd(serialized);
    expect(parsed).toEqual(original);
  });
});

describe("isJsonLdNode", () => {
  it("returns true for objects with @context or @type", () => {
    expect(isJsonLdNode({ "@context": "https://schema.org" })).toBe(true);
    expect(isJsonLdNode({ "@type": "Thing" })).toBe(true);
    expect(isJsonLdNode({ "@context": "https://schema.org", "@type": "Thing" })).toBe(true);
  });

  it("returns false for plain objects without JSON-LD keys", () => {
    expect(isJsonLdNode({ name: "no context" })).toBe(false);
    expect(isJsonLdNode({})).toBe(false);
  });

  it("returns false for non-objects", () => {
    expect(isJsonLdNode(null)).toBe(false);
    expect(isJsonLdNode(undefined)).toBe(false);
    expect(isJsonLdNode("string")).toBe(false);
    expect(isJsonLdNode(42)).toBe(false);
    expect(isJsonLdNode(["@context", "val"])).toBe(false);
  });
});
