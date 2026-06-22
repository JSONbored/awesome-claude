import { describe, expect, it } from "vitest";

import {
  isSourceBackedEntry,
  hasInstallSurface,
  hasSafeInstallSignal,
} from "@/lib/growth-surface-rules";

describe("isSourceBackedEntry", () => {
  it("is true only when the trust signal reports an available source", () => {
    // "source-backed" discovery surfaces rely on a confirmed-reachable source,
    // so only the explicit "available" status qualifies.
    expect(
      isSourceBackedEntry({ trustSignals: { sourceStatus: "available" } }),
    ).toBe(true);
    expect(
      isSourceBackedEntry({ trustSignals: { sourceStatus: "unavailable" } }),
    ).toBe(false);
    expect(isSourceBackedEntry({})).toBe(false);
  });
});

describe("hasInstallSurface", () => {
  it("is true when any install affordance is present", () => {
    // An entry is installable if it exposes a command, a download, or a config
    // snippet — any one is enough to surface install-oriented lists.
    expect(hasInstallSurface({ installCommand: "npx example" })).toBe(true);
    expect(hasInstallSurface({ downloadUrl: "/downloads/skills/x.zip" })).toBe(
      true,
    );
    expect(hasInstallSurface({ configSnippet: "{}" })).toBe(true);
  });

  it("is false when no install affordance exists", () => {
    expect(hasInstallSurface({})).toBe(false);
  });
});

describe("hasSafeInstallSignal", () => {
  it("requires a first-party download or a verified package", () => {
    // Safe-install surfaces only promote first-party or maintainer-verified
    // packages; external/unverified ones must not qualify.
    expect(hasSafeInstallSignal({ downloadTrust: "first-party" })).toBe(true);
    expect(hasSafeInstallSignal({ packageVerified: true })).toBe(true);
  });

  it("rejects external downloads and unverified packages", () => {
    expect(hasSafeInstallSignal({ downloadTrust: "external" })).toBe(false);
    expect(hasSafeInstallSignal({ packageVerified: false })).toBe(false);
    expect(hasSafeInstallSignal({})).toBe(false);
  });
});
