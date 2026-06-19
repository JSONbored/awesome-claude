import { describe, expect, it } from "vitest";

import {
  isPinnedPackageSpec,
  parsePackageSpec,
} from "@heyclaude/registry/package-spec";

describe("package spec parsing", () => {
  it("parses unscoped and scoped package specs", () => {
    expect(parsePackageSpec("modelcontextprotocol-server@1.2.3")).toEqual({
      name: "modelcontextprotocol-server",
      scope: "",
      version: "1.2.3",
    });
    expect(
      parsePackageSpec("@modelcontextprotocol/server-github@1.2.3-beta.1"),
    ).toEqual({
      name: "@modelcontextprotocol/server-github",
      scope: "@modelcontextprotocol",
      version: "1.2.3-beta.1",
    });
    expect(parsePackageSpec("@modelcontextprotocol/server-github")).toEqual({
      name: "@modelcontextprotocol/server-github",
      scope: "@modelcontextprotocol",
      version: "",
    });
  });

  it("treats only exact semver versions as pinned", () => {
    expect(isPinnedPackageSpec("@scope/server@1.2.3")).toBe(true);
    expect(isPinnedPackageSpec("@scope/server@1.2.3-beta.1")).toBe(true);
    expect(isPinnedPackageSpec("@scope/server@1.2.3+build.5")).toBe(true);

    for (const spec of [
      "@scope/server",
      "@scope/server@latest",
      "@scope/server@next",
      "@scope/server@^1.2.3",
      "@scope/server@~1.2.3",
      "@scope/server@1",
      "@scope/server@1.2",
      "@scope/server@1.x",
      "@scope/server@*",
      "server@>=1.2.3",
    ]) {
      expect(isPinnedPackageSpec(spec), spec).toBe(false);
    }
  });

  it("rejects non-package specs", () => {
    expect(parsePackageSpec("https://example.com/package.tgz")).toBeNull();
    expect(parsePackageSpec("--package")).toBeNull();
    expect(parsePackageSpec("name with spaces@1.2.3")).toBeNull();
    expect(parsePackageSpec("@missing-slash")).toBeNull();
  });
});
