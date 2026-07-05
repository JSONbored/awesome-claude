import { describe, expect, it } from "vitest";

import { parsePackageSpec } from "@heyclaude/registry/package-spec";

describe("registry package-spec re-export", () => {
  it("re-exports parsePackageSpec through the public registry surface", () => {
    expect(parsePackageSpec("demo-package@1.2.3")).toEqual({
      name: "demo-package",
      scope: "",
      version: "1.2.3",
    });
  });
});
