import { describe, expect, it } from "vitest";

import {
  SHELL_MOBILE_NAV_SECTIONS,
  SHELL_PRIMARY_NAV,
  flattenShellMobileNav,
  shellNavItemActive,
} from "../apps/web/src/lib/app-shell-nav-lib";

describe("app-shell-nav-lib", () => {
  it("marks browse and nested paths active", () => {
    expect(shellNavItemActive("/browse", "/browse")).toBe(true);
    expect(shellNavItemActive("/browse/tools", "/browse")).toBe(true);
    expect(shellNavItemActive("/trending", "/browse")).toBe(false);
  });

  it("treats the home route as active only on exact match", () => {
    expect(shellNavItemActive("/", "/")).toBe(true);
    expect(shellNavItemActive("/browse", "/")).toBe(false);
  });

  it("groups mobile navigation into product areas", () => {
    expect(SHELL_PRIMARY_NAV.map((item) => item.to)).toContain("/quality");
    expect(SHELL_MOBILE_NAV_SECTIONS.map((section) => section.id)).toEqual([
      "explore",
      "trust",
      "api-mcp",
      "community",
    ]);
    expect(
      flattenShellMobileNav().some(
        (link) => link.to === "/integrations/mcp-server",
      ),
    ).toBe(true);
    expect(flattenShellMobileNav()).toHaveLength(
      SHELL_MOBILE_NAV_SECTIONS.reduce(
        (count, section) => count + section.links.length,
        0,
      ),
    );
  });
});
