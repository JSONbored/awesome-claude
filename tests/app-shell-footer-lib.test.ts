import { describe, expect, it } from "vitest";

import {
  SHELL_FOOTER_COLUMNS,
  footerColumnSpanClass,
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
    expect(footerColumnSpanClass(3)).toBe("md:col-span-3");
    expect(footerColumnSpanClass()).toBe("md:col-span-2");
  });
});
