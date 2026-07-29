import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { repoRoot } from "./helpers/registry-fixtures";

// Entry detail command-center tab switcher used aria-pressed toggles; copy-segmented
// already implements radiogroup + arrow-key navigation for the same UI (#5635).
describe("entry detail command-center tab radiogroup (#5635)", () => {
  const source = fs.readFileSync(
    path.join(
      repoRoot,
      "apps/web/src/components/entry-detail-command-center.tsx",
    ),
    "utf8",
  );

  it("uses a radiogroup for install/config/full tabs", () => {
    expect(source).toContain('role="radiogroup"');
    expect(source).toContain('aria-label="Choose payload view"');
    expect(source).toContain('role="radio"');
    expect(source).toContain("aria-checked={isActive}");
    expect(source).toContain("tabIndex={isActive ? 0 : -1}");
    expect(source).not.toContain("aria-pressed={tab === t}");
  });

  it("supports arrow-key navigation between available tabs", () => {
    expect(source).toContain("onKeyDown={onTabKeyDown}");
    expect(source).toContain('event.key === "ArrowRight"');
    expect(source).toContain('event.key === "ArrowLeft"');
    expect(source).toContain('event.key === "Home"');
    expect(source).toContain('event.key === "End"');
  });
});
