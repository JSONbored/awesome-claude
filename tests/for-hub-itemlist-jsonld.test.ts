import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { buildItemListJsonLd } from "@heyclaude/registry/seo";

import { repoRoot } from "./helpers/registry-fixtures";

// /for renders every platform as a /for/$platform link but head() only emitted
// BreadcrumbList JSON-LD. /platforms already pairs breadcrumb + ItemList for the
// same destinations — pin the /for head() parity at the source level (#5630).
describe("/for hub ItemList JSON-LD (#5630)", () => {
  const source = fs.readFileSync(
    path.join(repoRoot, "apps/web/src/routes/for.index.tsx"),
    "utf8",
  );

  it("imports breadcrumbScript and itemListScript", () => {
    expect(source).toContain(
      'import { breadcrumbScript, itemListScript } from "@/lib/seo-jsonld";',
    );
  });

  it("emits BreadcrumbList and ItemList scripts from head()", () => {
    expect(source).toContain("scripts: [");
    expect(source).toContain("breadcrumbScript([");
    expect(source).toContain('{ name: "Directory", path: "/browse" }');
    expect(source).toContain('{ name: "Platforms", path: "/for" }');
    expect(source).toContain("itemListScript(");
    expect(source).toContain("path: `/for/${id}`");
    expect(source).toContain('{ name: "Claude platforms" }');
  });

  it("builds a valid ItemList for sample platform destinations", () => {
    const itemList = buildItemListJsonLd(
      [
        { name: "Claude Code", url: "https://heyclau.de/for/claude-code" },
        { name: "Cursor", url: "https://heyclau.de/for/cursor" },
      ],
      { name: "Claude platforms" },
    );
    expect(itemList["@type"]).toBe("ItemList");
    expect(itemList.name).toBe("Claude platforms");
    expect(itemList.itemListElement).toHaveLength(2);
    expect(itemList.itemListElement[0]).toMatchObject({
      "@type": "ListItem",
      position: 1,
      name: "Claude Code",
      url: "https://heyclau.de/for/claude-code",
    });
  });
});
