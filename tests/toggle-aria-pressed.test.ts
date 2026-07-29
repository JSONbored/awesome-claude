import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { repoRoot } from "./helpers/registry-fixtures";

function routeSource(file: string) {
  return fs.readFileSync(
    path.join(repoRoot, "apps/web/src/routes", file),
    "utf8",
  );
}

describe("two-state toggle aria-pressed exposure (#5476)", () => {
  // Three two-state toggle controls drove their active styling from a boolean /
  // enum comparison but never exposed that state to assistive technology.
  // Routes are not importable in the node suite, so pin the attributes at the
  // source level, the same way web-platform-pages.test.ts pins the #5537
  // noindex guard. The comparison inside each aria-pressed is exactly the one
  // already driving the button's active className.
  it("jobs filter buttons expose aria-pressed for is:fresh and Featured only", () => {
    const source = routeSource("jobs.index.tsx");
    expect(source).toContain("aria-pressed={freshOnly}");
    expect(source).toContain("aria-pressed={featuredOnly}");
  });

  it("jobs.post tier tiles expose aria-pressed for the selected tier", () => {
    const source = routeSource("jobs.post.tsx");
    expect(source).toContain("aria-pressed={tier === t.id}");
  });

  it("claim type buttons expose aria-pressed for the selected claim type", () => {
    const source = routeSource("claim.tsx");
    expect(source).toContain("aria-pressed={type === t}");
  });

  it("advertise tier tiles expose aria-pressed for the selected plan", () => {
    // Trending category filters moved to FilterChip radiogroup (#5636); advertise
    // still uses the two-state aria-pressed toggle pattern from #5476.
    expect(routeSource("advertise.tsx")).toContain(
      "aria-pressed={planId === p.id}",
    );
  });
});
