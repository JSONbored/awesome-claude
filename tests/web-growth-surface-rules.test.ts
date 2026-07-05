import { describe, expect, it } from "vitest";

import {
  buildDiscoverySurfaceLists,
  hasInstallSurface,
  hasSafeInstallSignal,
  isSourceBackedEntry,
} from "@/lib/growth-surface-rules";

describe("growth-surface-rules re-export surface", () => {
  it("keeps the public import path wired to the extracted lib", () => {
    expect(
      isSourceBackedEntry({ trustSignals: { sourceStatus: "available" } }),
    ).toBe(true);
    expect(hasInstallSurface({ installCommand: "npx demo" })).toBe(true);
    expect(hasSafeInstallSignal({ packageVerified: true })).toBe(true);
    expect(
      buildDiscoverySurfaceLists([
        {
          slug: "demo",
          dateAdded: "2026-05-20",
          installCommand: "npx demo",
          downloadTrust: "first-party",
        },
      ]).safeInstall.map((item) => item.slug),
    ).toEqual(["demo"]);
  });
});
