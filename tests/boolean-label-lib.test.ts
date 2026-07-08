import { describe, expect, it } from "vitest";

import { booleanLabel } from "../apps/web/src/lib/boolean-label-lib";

describe("booleanLabel", () => {
  it("returns undefined for an absent value", () => {
    expect(booleanLabel(undefined)).toBeUndefined();
  });

  it("maps true to Yes and false to No", () => {
    expect(booleanLabel(true)).toBe("Yes");
    expect(booleanLabel(false)).toBe("No");
  });
});
