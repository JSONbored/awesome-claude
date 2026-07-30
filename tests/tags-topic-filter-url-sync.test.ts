import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { repoRoot } from "./helpers/registry-fixtures";

const tagsSource = () =>
  fs.readFileSync(
    path.join(repoRoot, "apps/web/src/routes/tags.index.tsx"),
    "utf8",
  );

describe("tags topic-filter URL sync (#5712)", () => {
  it("defines validateSearch with q and strips empty defaults", () => {
    const source = tagsSource();
    expect(source).toContain("validateSearch: tagsSearchSchema");
    expect(source).toContain("stripSearchParams(defaultSearch)");
    expect(source).toContain("q: z.string()");
    expect(source).toContain('q: ""');
  });

  it("debounces local input into navigate({ search }) like browse", () => {
    const source = tagsSource();
    expect(source).toContain("Route.useSearch()");
    expect(source).toContain("Route.useNavigate()");
    expect(source).toContain("React.useState(sp.q)");
    expect(source).toContain(
      "navigate({ search: (prev: typeof sp) => ({ ...prev, q: query }), replace: true })",
    );
  });
});
