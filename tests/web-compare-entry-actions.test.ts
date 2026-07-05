import { describe, expect, it } from "vitest";

import {
  compareActionSignature,
  resolveCompareEntryActions,
} from "@/lib/compare-entry-actions";

describe("compare-entry-actions re-export surface", () => {
  it("keeps the public import path wired to the extracted lib", () => {
    expect(
      resolveCompareEntryActions({ category: "mcp", slug: "x" }).map(
        (a) => a.id,
      ),
    ).toEqual(["dossier", "claim"]);
    expect(
      compareActionSignature({
        category: "mcp",
        slug: "x",
        claimed: true,
      } as never),
    ).toBe("dossier");
  });
});
