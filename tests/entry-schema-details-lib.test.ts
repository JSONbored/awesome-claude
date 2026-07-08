import { describe, expect, it } from "vitest";

import type { Entry } from "../apps/web/src/types/registry";
import { hasSchemaDetails } from "../apps/web/src/lib/entry-schema-details-lib";

const entry = (over: Partial<Entry> = {}) => ({ ...over }) as Entry;

describe("hasSchemaDetails", () => {
  it("is false when none of the optional schema fields are present", () => {
    expect(hasSchemaDetails(entry())).toBe(false);
  });

  it("is true when a scalar schema field is set", () => {
    expect(hasSchemaDetails(entry({ skillType: "capability" }))).toBe(true);
    expect(hasSchemaDetails(entry({ difficulty: "intermediate" }))).toBe(true);
  });

  it("is true for a non-empty array field but false for an empty one", () => {
    expect(hasSchemaDetails(entry({ testedPlatforms: ["claude-code"] }))).toBe(
      true,
    );
    expect(hasSchemaDetails(entry({ testedPlatforms: [] }))).toBe(false);
  });

  it("treats an explicit packageVerified: false as details present", () => {
    expect(hasSchemaDetails(entry({ packageVerified: false }))).toBe(true);
  });
});
