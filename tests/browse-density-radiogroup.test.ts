import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { repoRoot } from "./helpers/registry-fixtures";

describe("browse density toggle radiogroup semantics (#5454)", () => {
  // The density toggle's container is a role="radiogroup", but its buttons used
  // aria-pressed (the toggle-button pattern) instead of role="radio" +
  // aria-checked, so assistive tech saw a radiogroup whose children expose no
  // radio semantics. Routes are not importable in the node suite, so pin the
  // corrected attributes at the source level, the same way
  // web-platform-pages.test.ts pins the #5537 noindex guard.
  const source = fs.readFileSync(
    path.join(repoRoot, "apps/web/src/routes/browse.tsx"),
    "utf8",
  );
  const densityStart = source.indexOf('aria-label="Result density"');
  // The density toggle block: from the radiogroup label through the mapped
  // buttons' closing tag.
  const densityBlock = source.slice(
    densityStart,
    source.indexOf("</button>", densityStart),
  );

  it("locates the density radiogroup", () => {
    expect(densityStart).toBeGreaterThan(-1);
  });

  it("density buttons expose role=radio with aria-checked selection state", () => {
    expect(densityBlock).toContain('role="radio"');
    expect(densityBlock).toContain("aria-checked={sp.view === v}");
  });

  it("density buttons no longer use the toggle-button aria-pressed pattern", () => {
    expect(densityBlock).not.toContain("aria-pressed");
    // The whole file has no other aria-pressed either — every remaining
    // single-select group in browse.tsx uses the radio pattern (FilterChip).
    expect(source).not.toContain("aria-pressed");
  });
});
