import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import { buildItemListJsonLd } from "@heyclaude/registry/seo";

import { repoRoot } from "./helpers/registry-fixtures";

// /tags renders every indexable tag as a /tags/$tag link but head() only emitted
// BreadcrumbList JSON-LD. Sibling hub routes (/best, /compare, /integrations, …)
// already pair breadcrumb + ItemList — pin the /tags head() parity (#5631).
describe("/tags hub ItemList JSON-LD (#5631)", () => {
  const source = fs.readFileSync(
    path.join(repoRoot, "apps/web/src/routes/tags.index.tsx"),
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
    expect(source).toContain('{ name: "Tags", path: "/tags" }');
    expect(source).toContain("itemListScript(");
    expect(source).toContain("getIndexableTagGroups()");
    expect(source).toContain("path: `/tags/${tag.slug}`");
    expect(source).toContain('{ name: "Claude resource tags" }');
  });

  it("builds a valid ItemList for sample tag destinations", () => {
    const itemList = buildItemListJsonLd(
      [
        { name: "MCP", url: "https://heyclau.de/tags/mcp" },
        { name: "Claude Code", url: "https://heyclau.de/tags/claude-code" },
      ],
      { name: "Claude resource tags" },
    );
    expect(itemList["@type"]).toBe("ItemList");
    expect(itemList.name).toBe("Claude resource tags");
    expect(itemList.itemListElement).toHaveLength(2);
    expect(itemList.itemListElement[0]).toMatchObject({
      "@type": "ListItem",
      position: 1,
      name: "MCP",
      url: "https://heyclau.de/tags/mcp",
    });
  });
});
