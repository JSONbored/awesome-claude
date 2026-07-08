import { describe, expect, it } from "vitest";

import type { Entry } from "../apps/web/src/types/registry";
import { CATEGORIES } from "../apps/web/src/types/registry";
import { categoryLabels } from "../apps/web/src/lib/site";
import { categorySpread } from "../apps/web/src/lib/category-spread-lib";

const entry = (category: string) => ({ category }) as Entry;
const labelFor = (id: string) =>
  categoryLabels[id] ?? CATEGORIES.find((c) => c.id === id)?.label ?? id;

describe("categorySpread", () => {
  it("returns [] for no entries", () => {
    expect(categorySpread([])).toEqual([]);
  });

  it("lists the most common category labels first", () => {
    const result = categorySpread([entry("mcp"), entry("mcp"), entry("hooks")]);
    expect(result).toEqual([labelFor("mcp"), labelFor("hooks")]);
  });

  it("honors the limit", () => {
    const result = categorySpread(
      [entry("mcp"), entry("hooks"), entry("skills")],
      1,
    );
    expect(result).toHaveLength(1);
  });

  it("falls back to the raw id for an unknown category", () => {
    expect(categorySpread([entry("totally-unknown-cat")])).toEqual([
      "totally-unknown-cat",
    ]);
  });
});
