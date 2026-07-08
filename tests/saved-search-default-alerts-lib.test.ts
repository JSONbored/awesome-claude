import { describe, expect, it } from "vitest";

import { defaultAlerts } from "../apps/web/src/lib/saved-search-default-alerts-lib";

describe("defaultAlerts", () => {
  it("returns an enabled, in-app, instant schedule", () => {
    expect(defaultAlerts()).toEqual({
      enabled: true,
      channels: ["inapp"],
      cadence: "instant",
    });
  });

  it("returns a fresh object each call (safe to mutate)", () => {
    const a = defaultAlerts();
    const b = defaultAlerts();
    expect(a).not.toBe(b);
    expect(a.channels).not.toBe(b.channels);
  });
});
