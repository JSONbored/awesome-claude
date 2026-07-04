import { describe, expect, it } from "vitest";

import {
  getTrustReasons,
  installRiskLevel,
  INSTALL_RISK_LABEL,
  summarizeTrust,
} from "@/lib/trust";
import type { Entry } from "@/types/registry";

function entry(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "skills",
    slug: "demo",
    title: "Demo",
    description: "d",
    trust: "trusted",
    source: "first-party",
    platforms: [],
    tags: [],
    ...overrides,
  } as Entry;
}

describe("trust re-export surface", () => {
  it("keeps the public import path wired to the extracted lib", () => {
    const reasons = getTrustReasons(entry({ reviewed: false }));
    expect(summarizeTrust(reasons).warning).toBeGreaterThan(0);
    expect(installRiskLevel(entry({ trust: "blocked" }))).toBe("high");
    expect(INSTALL_RISK_LABEL.low).toBe("Low risk");
  });
});
