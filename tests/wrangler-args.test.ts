import { describe, expect, it } from "vitest";

import { wranglerArgs } from "../scripts/lib/wrangler-args.mjs";

describe("wranglerArgs", () => {
  it("targets --local for a non-remote run mode", () => {
    expect(wranglerArgs("local", "SELECT 1;", "SITE_DB")).toEqual([
      "d1",
      "execute",
      "SITE_DB",
      "--local",
      "--command",
      "SELECT 1;",
    ]);
  });

  it("targets --remote for the remote run mode", () => {
    expect(wranglerArgs("remote", "SELECT 1;", "SITE_DB")).toEqual([
      "d1",
      "execute",
      "SITE_DB",
      "--remote",
      "--command",
      "SELECT 1;",
    ]);
  });

  it("appends --json only when requested", () => {
    expect(
      wranglerArgs("local", "SELECT 1;", "SITE_DB", { json: true }),
    ).toEqual([
      "d1",
      "execute",
      "SITE_DB",
      "--local",
      "--command",
      "SELECT 1;",
      "--json",
    ]);
    expect(
      wranglerArgs("local", "SELECT 1;", "SITE_DB", { json: false }),
    ).not.toContain("--json");
  });

  it("uses the injected binding name", () => {
    expect(wranglerArgs("remote", "SELECT 1;", "OTHER_DB")[2]).toBe("OTHER_DB");
  });
});
