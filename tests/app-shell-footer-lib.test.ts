import { describe, expect, it } from "vitest";

import {
  SHELL_FOOTER_BRAND_SPAN,
  SHELL_FOOTER_COLUMNS,
  SHELL_FOOTER_GRID_COLUMNS,
  footerColumnSpanClass,
  shellFooterBrandSpanClass,
  shellFooterColumnSpans,
  shellFooterLayoutFitsGrid,
} from "../apps/web/src/lib/app-shell-footer-lib";

describe("app-shell-footer-lib", () => {
  it("organizes footer links into product, contribution, API, and community columns", () => {
    expect(SHELL_FOOTER_COLUMNS.map((column) => column.id)).toEqual([
      "product",
      "contribution",
      "api-mcp",
      "community",
    ]);
    const contribution = SHELL_FOOTER_COLUMNS.find(
      (column) => column.id === "contribution",
    );
    expect(contribution?.links.map((link) => link.to)).toEqual([
      "/submit",
      "/claim",
      "/contributors",
      "/validators",
      "/advertise",
    ]);
  });

  it("maps footer column spans to grid classes", () => {
    expect(footerColumnSpanClass(4)).toBe("md:col-span-4");
    expect(footerColumnSpanClass(3)).toBe("md:col-span-3");
    expect(footerColumnSpanClass(2)).toBe("md:col-span-2");
    expect(footerColumnSpanClass()).toBe("md:col-span-2");
    expect(shellFooterBrandSpanClass()).toBe("md:col-span-4");
    expect(shellFooterBrandSpanClass(3)).toBe("md:col-span-3");
    expect(shellFooterBrandSpanClass(2)).toBe("md:col-span-2");
  });

  it("fits brand and link columns into the 12-column footer grid", () => {
    expect(shellFooterLayoutFitsGrid()).toBe(true);
    expect(shellFooterColumnSpans()).toEqual({
      brandSpan: SHELL_FOOTER_BRAND_SPAN,
      linkSpans: [2, 2, 2, 2],
      totalSpan: SHELL_FOOTER_GRID_COLUMNS,
    });
    expect(
      shellFooterLayoutFitsGrid(
        SHELL_FOOTER_COLUMNS.map((column) => ({ ...column, span: 3 })),
      ),
    ).toBe(false);
  });

  it("keeps external policy links in the community column", () => {
    const community = SHELL_FOOTER_COLUMNS.find(
      (column) => column.id === "community",
    );
    expect(community?.links.map((link) => link.to)).toEqual([
      "/about",
      "/jobs",
      "/state-of-claude-tooling",
    ]);
  });
});
