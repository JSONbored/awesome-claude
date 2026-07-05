import { describe, expect, it } from "vitest";

import {
  installMethodDistribution,
  installMethodOf,
  notesCoverage,
} from "@/lib/ecosystem-stats";

describe("ecosystem-stats re-export surface", () => {
  it("keeps the public import path wired to the extracted lib", () => {
    expect(installMethodOf("npx pkg")).toBe("npm / npx");
    expect(
      installMethodDistribution([{ installCommand: "npx a" } as never]).total,
    ).toBe(1);
    expect(notesCoverage([{ safetyNotes: "x" } as never]).safety).toBe(1);
  });
});
