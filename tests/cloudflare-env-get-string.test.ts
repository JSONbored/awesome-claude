import { afterEach, describe, expect, it } from "vitest";

import { getEnvString } from "@/lib/cloudflare-env.server";

const TOUCHED = [
  "TEST_ENV_A",
  "TEST_ENV_B",
  "TEST_ENV_EMPTY",
  "TEST_ENV_MISSING",
] as const;

afterEach(() => {
  // Keep process.env clean between cases so ordering can't leak state.
  for (const name of TOUCHED) delete process.env[name];
});

describe("getEnvString", () => {
  it("returns the trimmed value of a present variable", () => {
    process.env.TEST_ENV_A = "  hello  ";
    expect(getEnvString("TEST_ENV_A")).toBe("hello");
  });

  it("returns the first name that resolves to a non-empty value", () => {
    process.env.TEST_ENV_A = "first";
    process.env.TEST_ENV_B = "second";
    expect(getEnvString("TEST_ENV_A", "TEST_ENV_B")).toBe("first");
  });

  it("falls through to a later name when earlier ones are missing", () => {
    process.env.TEST_ENV_B = "second";
    expect(getEnvString("TEST_ENV_MISSING", "TEST_ENV_B")).toBe("second");
  });

  it("skips whitespace-only values and keeps scanning", () => {
    // A blank/whitespace var is treated as unset, not as a valid empty value.
    process.env.TEST_ENV_EMPTY = "   ";
    process.env.TEST_ENV_B = "second";
    expect(getEnvString("TEST_ENV_EMPTY", "TEST_ENV_B")).toBe("second");
  });

  it("returns an empty string when no name resolves", () => {
    expect(getEnvString("TEST_ENV_MISSING")).toBe("");
  });
});
