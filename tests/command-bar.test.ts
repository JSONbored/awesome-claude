import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { repoRoot } from "./helpers/registry-fixtures";

// ARIA combobox keeps focus on the input; panel buttons are pointer affordances
// driven via aria-activedescendant + Enter. They must stay out of the tab order
// so keyboard users are not stranded on onMouseDown-only controls (#5677).
describe("command-bar keyboard focus model (#5677)", () => {
  const source = fs.readFileSync(
    path.join(repoRoot, "apps/web/src/components/command-bar.tsx"),
    "utf8",
  );

  it("keeps scope pills, action buttons, and footer out of the tab order", () => {
    const tabIndexNegOne = [...source.matchAll(/tabIndex=\{-1\}/g)];
    expect(tabIndexNegOne.length).toBeGreaterThanOrEqual(3);
    expect(source).toMatch(/onMouseDown=\{[\s\S]*?setQuickCat/);
    expect(source).toMatch(/onMouseDown=\{[\s\S]*?activate\(/);
    expect(source).toMatch(/onMouseDown=\{[\s\S]*?submit\(/);
  });
});
