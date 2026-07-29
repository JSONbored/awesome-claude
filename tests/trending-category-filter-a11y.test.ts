import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { repoRoot } from "./helpers/registry-fixtures";

// /trending category chips were plain aria-pressed buttons; /browse already uses
// FilterChipGroup/FilterChip radiogroup for the same control — pin the parity (#5636).
describe("/trending category filter radiogroup (#5636)", () => {
  const source = fs.readFileSync(
    path.join(repoRoot, "apps/web/src/routes/trending.tsx"),
    "utf8",
  );

  it("imports FilterChipGroup and FilterChip", () => {
    expect(source).toContain(
      'import { FilterChip, FilterChipGroup } from "@/components/filter-chip";',
    );
  });

  it("renders category filters as a single-select radiogroup", () => {
    expect(source).toContain(
      'FilterChipGroup label="Filter by category" multi={false}',
    );
    expect(source).toContain('role="radio"');
    expect(source).not.toContain("aria-pressed={!sp.category}");
    expect(source).not.toContain("aria-pressed={active}");
  });

  it("preserves category filter analytics tracking", () => {
    expect(source).toContain("trackCategoryFilter(");
    expect(source).toContain('set({ category: active ? "" : category.id })');
  });
});
