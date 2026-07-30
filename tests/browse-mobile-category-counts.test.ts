import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { repoRoot } from "./helpers/registry-fixtures";

const browseSource = () =>
  fs.readFileSync(
    path.join(repoRoot, "apps/web/src/routes/browse.tsx"),
    "utf8",
  );

describe("browse mobile category chips show counts (#5717)", () => {
  // Desktop category chips and mobile signal chips already pass axisCount;
  // the mobile category row omitted count — pin parity at the source.
  it("passes axisCount category counts on the mobile category FilterChip row", () => {
    const source = browseSource();
    expect(source).toContain('aria-label="Filter by category"');
    expect(source).toContain(
      'count={c.id ? axisCount("category", c.id) : undefined}',
    );
  });

  it("keeps desktop category counts and mobile signal counts as references", () => {
    const source = browseSource();
    expect(source).toContain('count={axisCount("category", c.id)}');
    expect(source).toContain('count={axisCount("signal", option.id)}');
  });
});
