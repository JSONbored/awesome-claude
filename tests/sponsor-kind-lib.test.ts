import { describe, expect, it } from "vitest";

import { sponsorKindLabel } from "../apps/web/src/lib/sponsor-kind-lib";

describe("sponsorKindLabel", () => {
  it("maps each known sponsor kind to its badge label", () => {
    expect(sponsorKindLabel("ai")).toBe("AI");
    expect(sponsorKindLabel("infra")).toBe("INFRA");
    expect(sponsorKindLabel("credits")).toBe("CREDITS");
  });

  it("falls back to SERVICE for an unknown kind", () => {
    expect(sponsorKindLabel("partner")).toBe("SERVICE");
    expect(sponsorKindLabel("")).toBe("SERVICE");
  });

  it("is case-sensitive (only the exact lowercase keys match)", () => {
    expect(sponsorKindLabel("AI")).toBe("SERVICE");
  });
});
