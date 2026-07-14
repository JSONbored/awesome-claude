import { describe, expect, it } from "vitest";

import { parseNpmVersionOutput } from "../scripts/lib/npm-version.mjs";

describe("parseNpmVersionOutput", () => {
  it("returns a JSON string payload as-is", () => {
    expect(parseNpmVersionOutput('"1.2.3"')).toBe("1.2.3");
  });

  it("returns null for a non-string JSON payload", () => {
    expect(parseNpmVersionOutput("123")).toBeNull();
    expect(parseNpmVersionOutput('["1.0.0","2.0.0"]')).toBeNull();
    expect(parseNpmVersionOutput("null")).toBeNull();
  });

  it("falls back to the trimmed text for non-JSON output", () => {
    expect(parseNpmVersionOutput("1.2.3\n")).toBe("1.2.3");
  });

  it("returns null when the non-JSON fallback is empty", () => {
    expect(parseNpmVersionOutput("   ")).toBeNull();
    expect(parseNpmVersionOutput("")).toBeNull();
    expect(parseNpmVersionOutput(undefined)).toBeNull();
  });
});
