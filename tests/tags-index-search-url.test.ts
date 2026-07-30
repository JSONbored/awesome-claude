import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { repoRoot } from "./helpers/registry-fixtures";

const tagsSource = () =>
  fs.readFileSync(
    path.join(repoRoot, "apps/web/src/routes/tags.index.tsx"),
    "utf8",
  );

describe("tags index topic-filter URL sync (#5712)", () => {
  it("defines a q search schema with stripSearchParams defaults", () => {
    const source = tagsSource();
    expect(source).toContain("validateSearch: searchSchema");
    expect(source).toContain("stripSearchParams(defaultSearch)");
    expect(source).toMatch(/defaultSearch\s*=\s*\{\s*q:\s*""/);
    expect(source).toContain("normalizeSearchQuery");
  });

  it("debounces local qInput into the URL with replace: true", () => {
    const source = tagsSource();
    expect(source).toContain("Route.useSearch()");
    expect(source).toContain("setQInput");
    expect(source).toContain("replace: true");
    expect(source).toContain("250");
    expect(source).toMatch(
      /navigate\(\{\s*search:\s*\(prev\)\s*=>\s*\(\{\s*\.\.\.prev,\s*q:\s*qInput\s*\}\)/,
    );
  });

  it("filters from URL search params, not only local input state", () => {
    const source = tagsSource();
    expect(source).toContain("const q = sp.q");
    expect(source).not.toMatch(
      /const \[query,\s*setQuery\]\s*=\s*React\.useState/,
    );
  });
});
