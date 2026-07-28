import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { buildBreadcrumbJsonLd } from "@heyclaude/registry/seo";

import { repoRoot } from "./helpers/registry-fixtures";

// /brief/$number renders a visible Breadcrumbs trail (Weekly Brief / Issue #N)
// but head() emitted no JSON-LD at all, unlike every sibling detail route that
// pairs its breadcrumb UI with BreadcrumbList structured data. Routes are not
// importable in the node suite, so pin the corrected head() at the source
// level, the same way state-report-dataset-distribution.test.ts pins #5455.
describe("/brief/$number BreadcrumbList JSON-LD (#5633)", () => {
  const source = fs.readFileSync(
    path.join(repoRoot, "apps/web/src/routes/brief.$number.tsx"),
    "utf8",
  );

  it("emits a breadcrumbScript from head()", () => {
    expect(source).toContain(
      'import { breadcrumbScript } from "@/lib/seo-jsonld";',
    );
    expect(source).toContain("scripts: [");
    expect(source).toContain('{ name: "Weekly Brief", path: "/brief" }');
    expect(source).toContain(
      "{ name: `Issue #${loaderData.number}`, path: `/brief/${loaderData.number}` }",
    );
  });

  it("matches the labels of the visible breadcrumb trail", () => {
    expect(source).toContain('label: "Weekly Brief"');
    expect(source).toContain("label: `Issue #${issue.number}`");
  });

  it("builds a valid BreadcrumbList shape for a sample issue trail", () => {
    const breadcrumb = buildBreadcrumbJsonLd([
      { name: "Weekly Brief", url: "https://heyclau.de/brief" },
      { name: "Issue #7", url: "https://heyclau.de/brief/7" },
    ]);
    expect(breadcrumb["@type"]).toBe("BreadcrumbList");
    expect(breadcrumb.itemListElement).toHaveLength(2);
    expect(breadcrumb.itemListElement[0]).toMatchObject({
      "@type": "ListItem",
      position: 1,
      name: "Weekly Brief",
      item: "https://heyclau.de/brief",
    });
    expect(breadcrumb.itemListElement[1]).toMatchObject({
      "@type": "ListItem",
      position: 2,
      name: "Issue #7",
      item: "https://heyclau.de/brief/7",
    });
  });
});
