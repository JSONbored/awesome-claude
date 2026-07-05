import { describe, expect, it } from "vitest";

import {
  isPinnedPackageSpec,
  parsePackageSpec,
} from "../packages/registry/src/package-spec-lib.js";

type ParsedSpec = {
  name: string;
  scope: string;
  version: string;
};

const VALID_UNSCOPED_NAMES = [
  "lodash",
  "react",
  "modelcontextprotocol-server",
  "a",
  "a1",
  "package-name",
  "package_name",
  "package.name",
  "PackageName",
  "UPPERCASE",
  "mixedCaseName",
  "name-with-many-dashes",
  "name.with.many.dots",
  "name_with_many_underscores",
  "123numeric-start",
  "a0b1c2",
];

const VALID_SCOPED_SPECS: Array<{ spec: string; name: string; scope: string }> =
  [
    {
      spec: "@scope/pkg",
      name: "@scope/pkg",
      scope: "@scope",
    },
    {
      spec: "@modelcontextprotocol/server-github",
      name: "@modelcontextprotocol/server-github",
      scope: "@modelcontextprotocol",
    },
    {
      spec: "@my-org/my_pkg",
      name: "@my-org/my_pkg",
      scope: "@my-org",
    },
    {
      spec: "@my.org/my.pkg",
      name: "@my.org/my.pkg",
      scope: "@my.org",
    },
    {
      spec: "@Scope/Package",
      name: "@Scope/Package",
      scope: "@Scope",
    },
    {
      spec: "@a/b",
      name: "@a/b",
      scope: "@a",
    },
    {
      spec: "@0123scope/0123package",
      name: "@0123scope/0123package",
      scope: "@0123scope",
    },
  ];

const EXACT_SEMVER_PINS: string[] = [
  "0.0.0",
  "0.0.1",
  "0.1.0",
  "1.0.0",
  "1.2.3",
  "10.20.30",
  "999.999.999",
  "1.2.3-alpha",
  "1.2.3-alpha.1",
  "1.2.3-alpha.beta.gamma",
  "1.2.3-0",
  "1.2.3-0123",
  "1.2.3-RC.1",
  "1.2.3-beta",
  "1.2.3-beta.1",
  "1.2.3+build",
  "1.2.3+build.5",
  "1.2.3+build.meta.data",
  "1.2.3-beta.1+build.5",
  "1.2.3+build.5-beta.1",
  "0.0.0-0+0",
];

const NON_EXACT_VERSIONS: string[] = [
  "",
  "latest",
  "next",
  "beta",
  "canary",
  "stable",
  "release",
  "v1.2.3",
  "1",
  "1.2",
  "1.x",
  "1.*",
  "*",
  "^1.2.3",
  "~1.2.3",
  ">=1.2.3",
  ">1.2.3",
  "<=1.2.3",
  "<1.2.3",
  "1.2.x",
  "1.2.*",
  "01.2.3",
  "1.02.3",
  "1.2.03",
  "1.2.3.4",
  "1.2.3+",
  "+build",
  "1.2.3-alpha..1",
  "1.2.3-",
  "1.2.3+build..5",
  "file:../local.tgz",
  "git+https://github.com/org/repo.git",
  "workspace:*",
  "catalog:",
  "tag",
];

const UNPARSEABLE_VERSION_SUFFIXES: string[] = [
  "1.2.3 - 2.0.0",
  "1.2.3+build 5",
  "1.2.3 build",
  "npm:other@1.2.3",
  "@latest",
];

const REJECTED_PACKAGE_SPECS: string[] = [
  "",
  "   ",
  "\t",
  "\n",
  "name with spaces",
  "name with spaces@1.2.3",
  "@scope with spaces/pkg",
  "@scope/pkg with spaces",
  "--package",
  "-leading-hyphen",
  "@-bad-scope/pkg",
  "@scope/-bad-pkg",
  ".leading-dot",
  "@.leading-dot-scope/pkg",
  "@scope/.leading-dot-pkg",
  "_leading-underscore",
  "@_leading-underscore-scope/pkg",
  "@scope/_leading-underscore-pkg",
  "@missing-slash",
  "@scope",
  "@scope/",
  "@/",
  "@/pkg",
  "https://example.com/package.tgz",
  "http://example.com/package.tgz",
  "git+ssh://git@github.com/org/repo.git",
  "git://github.com/org/repo.git",
  "file:../package.tgz",
  "npm:package@1.2.3",
  "foo/bar",
  "foo@bar@1.2.3",
  "name@@1.2.3",
  "@scope@name/1.2.3",
  "@@scope/name@1.2.3",
  "name @1.2.3",
  "@scope/name @1.2.3",
  "name@1.2.3\textra",
  "name@1.2.3 beta",
  "name@^ 1.2.3",
  "name@>= 1.2.3",
  "lodash@ 1.2.3",
  "lodash@ 1.2.3 ",
  "@scope/pkg@\t1.2.3+build.5",
  "💥",
  "na me",
  "@scope/na me",
  "name@1.2.3@extra",
  "name@latest@1.2.3",
  "pkg@npm:other@1.2.3",
  "pkg@@latest",
  ...UNPARSEABLE_VERSION_SUFFIXES.flatMap((version) => [`pkg@${version}`]),
];

const TRIM_NORMALIZED_SPECS: Array<{ spec: string; expected: ParsedSpec }> = [
  {
    spec: "name@1.2.3 ",
    expected: { name: "name", scope: "", version: "1.2.3" },
  },
  {
    spec: " name@1.2.3",
    expected: { name: "name", scope: "", version: "1.2.3" },
  },
  {
    spec: "name@1.2.3\n",
    expected: { name: "name", scope: "", version: "1.2.3" },
  },
  {
    spec: "  lodash@1.2.3  ",
    expected: { name: "lodash", scope: "", version: "1.2.3" },
  },
  {
    spec: "\t@scope/pkg@1.2.3-beta.1\n",
    expected: {
      name: "@scope/pkg",
      scope: "@scope",
      version: "1.2.3-beta.1",
    },
  },
];

const EMPTY_VERSION_SPECS: Array<{ spec: string; expected: ParsedSpec }> = [
  {
    spec: "name@",
    expected: { name: "name", scope: "", version: "" },
  },
  {
    spec: "name@ ",
    expected: { name: "name", scope: "", version: "" },
  },
  {
    spec: "@scope/name@",
    expected: { name: "@scope/name", scope: "@scope", version: "" },
  },
  {
    spec: "@scope/name@ ",
    expected: { name: "@scope/name", scope: "@scope", version: "" },
  },
];

const SCOPED_DOUBLE_AT_SUFFIXES: string[] = [
  "extra",
  "",
  "latest",
  "1.2.4",
  "^1.2.3",
  "~1.2.3",
  "*",
  ">=1.2.3",
  ">1.2.3",
  "<=1.2.3",
  "<1.2.3",
  "1",
  "1.2",
  "1.x",
  "1.*",
  "1.2.x",
  "1.2.*",
  "1.2.3.4",
  "01.2.3",
  "1.02.3",
  "1.2.03",
  "v1.2.3",
  "release",
  "canary",
  "stable",
  "beta",
  "next",
  "tag",
  "workspace:*",
  "catalog:",
  "npm:other@1.2.3",
  "git+https://github.com/org/repo.git",
  "file:../local.tgz",
  "http://example.com/package.tgz",
  "https://example.com/package.tgz",
];

const MALFORMED_SCOPED_SPECS: Array<{ spec: string; expected: ParsedSpec }> = [
  {
    spec: "@scope/name@@1.2.3",
    expected: { name: "@scope/name", scope: "@scope", version: "@1.2.3" },
  },
  {
    spec: "@scope/name@@latest",
    expected: { name: "@scope/name", scope: "@scope", version: "@latest" },
  },
  {
    spec: "@scope/name@npm:other@1.2.3",
    expected: {
      name: "@scope/name",
      scope: "@scope",
      version: "npm:other@1.2.3",
    },
  },
  {
    spec: "@scope/name@latest@1.2.3",
    expected: {
      name: "@scope/name",
      scope: "@scope",
      version: "latest@1.2.3",
    },
  },
  ...SCOPED_DOUBLE_AT_SUFFIXES.map((suffix) => ({
    spec: `@scope/name@1.2.3@${suffix}`,
    expected: {
      name: "@scope/name",
      scope: "@scope",
      version: `1.2.3@${suffix}`,
    },
  })),
];

function expectParsed(
  spec: unknown,
  expected: ParsedSpec | null,
  message?: string,
) {
  expect(parsePackageSpec(spec), message ?? String(spec)).toEqual(expected);
}

describe("parsePackageSpec", () => {
  describe("unscoped package names without versions", () => {
    it.each(VALID_UNSCOPED_NAMES)("parses bare unscoped name %s", (name) => {
      expectParsed(name, { name, scope: "", version: "" });
    });
  });

  describe("unscoped package names with exact semver pins", () => {
    it.each(VALID_UNSCOPED_NAMES)("parses %s@1.2.3", (name) => {
      expectParsed(`${name}@1.2.3`, {
        name,
        scope: "",
        version: "1.2.3",
      });
    });

    it.each(EXACT_SEMVER_PINS)("parses lodash@%s", (version) => {
      expectParsed(`lodash@${version}`, {
        name: "lodash",
        scope: "",
        version,
      });
    });
  });

  describe("scoped package names without versions", () => {
    it.each(VALID_SCOPED_SPECS)(
      "parses scoped spec $spec",
      ({ spec, name, scope }) => {
        expectParsed(spec, { name, scope, version: "" });
      },
    );
  });

  describe("scoped package names with exact semver pins", () => {
    it.each(VALID_SCOPED_SPECS)(
      "parses scoped spec $spec@1.2.3",
      ({ spec, name, scope }) => {
        expectParsed(`${spec}@1.2.3`, {
          name,
          scope,
          version: "1.2.3",
        });
      },
    );

    it.each(EXACT_SEMVER_PINS)("parses @scope/pkg@%s", (version) => {
      expectParsed(`@scope/pkg@${version}`, {
        name: "@scope/pkg",
        scope: "@scope",
        version,
      });
    });
  });

  describe("semver edge cases in parsed version strings", () => {
    it("preserves prerelease identifiers verbatim", () => {
      expectParsed("pkg@1.2.3-alpha.beta.gamma", {
        name: "pkg",
        scope: "",
        version: "1.2.3-alpha.beta.gamma",
      });
      expectParsed("@scope/pkg@1.2.3-RC.1", {
        name: "@scope/pkg",
        scope: "@scope",
        version: "1.2.3-RC.1",
      });
    });

    it("preserves build metadata verbatim", () => {
      expectParsed("pkg@1.2.3+build.meta", {
        name: "pkg",
        scope: "",
        version: "1.2.3+build.meta",
      });
      expectParsed("@scope/pkg@1.2.3+0123", {
        name: "@scope/pkg",
        scope: "@scope",
        version: "1.2.3+0123",
      });
    });

    it("preserves combined prerelease and build metadata", () => {
      expectParsed("pkg@1.2.3-beta.1+build.5", {
        name: "pkg",
        scope: "",
        version: "1.2.3-beta.1+build.5",
      });
      expectParsed("@scope/pkg@0.0.0-0+0", {
        name: "@scope/pkg",
        scope: "@scope",
        version: "0.0.0-0+0",
      });
    });

    it.each(NON_EXACT_VERSIONS.filter((version) => version !== ""))(
      "still parses non-exact version suffix pkg@%s",
      (version) => {
        expectParsed(`pkg@${version}`, {
          name: "pkg",
          scope: "",
          version,
        });
      },
    );

    it.each(NON_EXACT_VERSIONS.filter((version) => version !== ""))(
      "still parses scoped non-exact version suffix @scope/pkg@%s",
      (version) => {
        expectParsed(`@scope/pkg@${version}`, {
          name: "@scope/pkg",
          scope: "@scope",
          version,
        });
      },
    );

    it.each(UNPARSEABLE_VERSION_SUFFIXES)(
      "rejects unscoped version suffixes with embedded whitespace or extra @ in pkg@%s",
      (version) => {
        expect(parsePackageSpec(`pkg@${version}`)).toBeNull();
      },
    );
  });

  describe("whitespace handling", () => {
    it("trims leading and trailing whitespace from the full spec", () => {
      expectParsed("  lodash  ", { name: "lodash", scope: "", version: "" });
    });

    it.each(TRIM_NORMALIZED_SPECS)(
      "normalizes trimmed spec $spec",
      ({ spec, expected }) => {
        expectParsed(spec, expected);
      },
    );

    it.each([
      "name with spaces",
      "name with spaces@1.2.3",
      "@scope with spaces/pkg",
      "@scope/pkg with spaces",
      "name @1.2.3",
      "@scope/name @1.2.3",
      "name@1.2.3 beta",
      "name@1.2.3\textra",
      "lodash@ 1.2.3",
      "lodash@ 1.2.3 ",
      "@scope/pkg@\t1.2.3+build.5",
    ])("rejects internal whitespace in %s", (spec) => {
      expect(parsePackageSpec(spec)).toBeNull();
    });
  });

  describe("URL and alias-like specs", () => {
    it.each([
      "https://example.com/package.tgz",
      "http://example.com/package.tgz",
      "git+https://github.com/org/repo.git",
      "git+ssh://git@github.com/org/repo.git",
      "git://github.com/org/repo.git",
      "file:../package.tgz",
      "npm:package@1.2.3",
    ])("rejects URL or alias spec %s", (spec) => {
      expect(parsePackageSpec(spec)).toBeNull();
    });
  });

  describe("double @ and malformed scope separators", () => {
    it.each([
      "name@@1.2.3",
      "foo@bar@1.2.3",
      "@scope@name/1.2.3",
      "@@scope/name@1.2.3",
      "pkg@@latest",
    ])("rejects malformed unscoped separator spec %s", (spec) => {
      expect(parsePackageSpec(spec)).toBeNull();
    });

    it.each(MALFORMED_SCOPED_SPECS)(
      "parses scoped double-@ spec $spec with the first scoped separator",
      ({ spec, expected }) => {
        expectParsed(spec, expected);
      },
    );

    it.each(["@missing-slash", "@scope", "@scope/", "@/", "@/pkg"])(
      "rejects missing or empty scoped name %s",
      (spec) => {
        expect(parsePackageSpec(spec)).toBeNull();
      },
    );
  });

  describe("empty version suffixes", () => {
    it.each(EMPTY_VERSION_SPECS)(
      "parses trailing @ spec $spec as an empty version",
      ({ spec, expected }) => {
        expectParsed(spec, expected);
      },
    );
  });

  describe("invalid package names and unsafe inputs", () => {
    it.each(REJECTED_PACKAGE_SPECS)("rejects invalid spec %s", (spec) => {
      expect(parsePackageSpec(spec)).toBeNull();
    });

    it("treats nullish inputs as empty after coercion", () => {
      expect(parsePackageSpec(null)).toBeNull();
      expect(parsePackageSpec(undefined)).toBeNull();
      expect(parsePackageSpec("")).toBeNull();
    });

    it("coerces boolean and numeric inputs into package names", () => {
      expectParsed(0, { name: "0", scope: "", version: "" });
      expectParsed(false, { name: "false", scope: "", version: "" });
      expectParsed(NaN, { name: "NaN", scope: "", version: "" });
    });

    it("rejects values that start with a hyphen", () => {
      expect(parsePackageSpec("--install")).toBeNull();
      expect(parsePackageSpec("-a")).toBeNull();
      expect(parsePackageSpec("@scope/-pkg")).toBeNull();
    });
  });
});

describe("isPinnedPackageSpec", () => {
  describe("unscoped exact semver pins", () => {
    it.each(EXACT_SEMVER_PINS)("treats lodash@%s as pinned", (version) => {
      expect(isPinnedPackageSpec(`lodash@${version}`)).toBe(true);
    });
  });

  describe("scoped exact semver pins", () => {
    it.each(EXACT_SEMVER_PINS)("treats @scope/pkg@%s as pinned", (version) => {
      expect(isPinnedPackageSpec(`@scope/pkg@${version}`)).toBe(true);
    });

    it.each(VALID_SCOPED_SPECS)(
      "treats pinned scoped spec $spec@1.2.3-beta.1+build.5",
      ({ spec }) => {
        expect(isPinnedPackageSpec(`${spec}@1.2.3-beta.1+build.5`)).toBe(true);
      },
    );
  });

  describe("unscoped non-pinned version suffixes", () => {
    it.each(NON_EXACT_VERSIONS.filter((version) => version !== ""))(
      "does not treat lodash@%s as pinned",
      (version) => {
        expect(isPinnedPackageSpec(`lodash@${version}`), version).toBe(false);
      },
    );

    it("does not treat bare package names as pinned", () => {
      for (const name of VALID_UNSCOPED_NAMES) {
        expect(isPinnedPackageSpec(name), name).toBe(false);
      }
    });
  });

  describe("scoped non-pinned version suffixes", () => {
    it.each(NON_EXACT_VERSIONS.filter((version) => version !== ""))(
      "does not treat @scope/pkg@%s as pinned",
      (version) => {
        expect(isPinnedPackageSpec(`@scope/pkg@${version}`), version).toBe(
          false,
        );
      },
    );

    it.each(VALID_SCOPED_SPECS)(
      "does not treat bare scoped spec $spec as pinned",
      ({ spec }) => {
        expect(isPinnedPackageSpec(spec), spec).toBe(false);
      },
    );
  });

  describe("invalid and malformed specs", () => {
    it.each(REJECTED_PACKAGE_SPECS)(
      "does not treat rejected spec %s as pinned",
      (spec) => {
        expect(isPinnedPackageSpec(spec), spec).toBe(false);
      },
    );

    it.each(MALFORMED_SCOPED_SPECS)(
      "does not treat malformed scoped spec $spec as pinned",
      ({ spec }) => {
        expect(isPinnedPackageSpec(spec), spec).toBe(false);
      },
    );

    it.each(TRIM_NORMALIZED_SPECS.filter(({ expected }) => expected.version))(
      "treats trim-normalized pinned spec $spec as pinned",
      ({ spec }) => {
        expect(isPinnedPackageSpec(spec), spec).toBe(true);
      },
    );

    it.each(EMPTY_VERSION_SPECS)(
      "does not treat empty-version spec $spec as pinned",
      ({ spec }) => {
        expect(isPinnedPackageSpec(spec), spec).toBe(false);
      },
    );

    it("does not treat nullish inputs as pinned", () => {
      expect(isPinnedPackageSpec(null)).toBe(false);
      expect(isPinnedPackageSpec(undefined)).toBe(false);
      expect(isPinnedPackageSpec("")).toBe(false);
    });
  });

  describe("semver validation edge cases", () => {
    it("rejects leading-zero numeric semver segments", () => {
      expect(isPinnedPackageSpec("pkg@01.2.3")).toBe(false);
      expect(isPinnedPackageSpec("pkg@1.02.3")).toBe(false);
      expect(isPinnedPackageSpec("pkg@1.2.03")).toBe(false);
      expect(isPinnedPackageSpec("@scope/pkg@01.2.3")).toBe(false);
      expect(isPinnedPackageSpec("@scope/pkg@1.02.3")).toBe(false);
      expect(isPinnedPackageSpec("@scope/pkg@1.2.03")).toBe(false);
    });

    it("rejects partial and range-like semver fragments", () => {
      for (const version of ["1", "1.2", "1.x", "1.*", "*"]) {
        expect(isPinnedPackageSpec(`pkg@${version}`), version).toBe(false);
        expect(isPinnedPackageSpec(`@scope/pkg@${version}`), version).toBe(
          false,
        );
      }
    });

    it("rejects semver-like tags with v prefix", () => {
      expect(isPinnedPackageSpec("pkg@v1.2.3")).toBe(false);
      expect(isPinnedPackageSpec("@scope/pkg@v1.2.3")).toBe(false);
    });

    it("rejects malformed prerelease and build metadata", () => {
      for (const version of [
        "1.2.3-",
        "1.2.3+",
        "1.2.3-alpha..1",
        "1.2.3+build..5",
      ]) {
        expect(isPinnedPackageSpec(`pkg@${version}`), version).toBe(false);
        expect(isPinnedPackageSpec(`@scope/pkg@${version}`), version).toBe(
          false,
        );
      }
    });

    it("accepts zero major/minor/patch components when exact", () => {
      expect(isPinnedPackageSpec("pkg@0.0.0")).toBe(true);
      expect(isPinnedPackageSpec("pkg@0.1.0")).toBe(true);
      expect(isPinnedPackageSpec("@scope/pkg@0.0.0")).toBe(true);
    });
  });
});
