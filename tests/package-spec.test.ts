import { describe, expect, it } from "vitest";

import {
  isPinnedPackageSpec,
  parsePackageSpec,
} from "@heyclaude/registry/package-spec";

describe("parsePackageSpec", () => {
  it("splits unscoped specs into name and version", () => {
    expect(parsePackageSpec("foo")).toEqual({
      name: "foo",
      scope: null,
      version: null,
    });
    expect(parsePackageSpec("foo@1.2.3")).toEqual({
      name: "foo",
      scope: null,
      version: "1.2.3",
    });
  });

  it("splits scoped specs, keeping scope and version separate", () => {
    expect(parsePackageSpec("@scope/foo")).toEqual({
      name: "@scope/foo",
      scope: "@scope",
      version: null,
    });
    expect(parsePackageSpec("@scope/foo@1.2.3")).toEqual({
      name: "@scope/foo",
      scope: "@scope",
      version: "1.2.3",
    });
  });

  it("returns null for empty input", () => {
    expect(parsePackageSpec("")).toBeNull();
    expect(parsePackageSpec(null)).toBeNull();
  });
});

describe("isPinnedPackageSpec", () => {
  it("treats exact semver versions as pinned", () => {
    for (const spec of [
      "foo@1.2.3",
      "@scope/foo@1.2.3",
      "foo@1.2.3-beta.1",
      "foo@2.0.0+build.5",
    ]) {
      expect(isPinnedPackageSpec(spec)).toBe(true);
    }
  });

  it("treats bare names, dist-tags, and ranges as unpinned", () => {
    for (const spec of [
      "foo",
      "@scope/foo",
      "foo@latest",
      "foo@next",
      "foo@^1.0.0",
      "foo@~1.2",
      "foo@1.x",
      "foo@*",
      "foo@1",
      "foo@1.2",
    ]) {
      expect(isPinnedPackageSpec(spec)).toBe(false);
    }
  });
});
