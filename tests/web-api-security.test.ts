import { describe, expect, it } from "vitest";

import {
  BodyTooLargeError,
  getClientIp,
  hasJsonContentType,
  isAllowedOrigin,
  __rateLimitTestHooks,
} from "@/lib/api-security";

describe("api-security re-export surface", () => {
  it("keeps the public import path wired to the extracted lib", () => {
    expect(getClientIp(new Request("https://heyclau.de/api/test"))).toBe(
      "unknown",
    );
    expect(
      isAllowedOrigin(
        new Request("https://heyclau.de/api/test", {
          headers: { origin: "https://heyclau.de" },
        }),
      ),
    ).toBe(true);
    expect(
      hasJsonContentType(
        new Request("https://heyclau.de/api/test", {
          headers: { "content-type": "application/json" },
        }),
      ),
    ).toBe(true);
    expect(new BodyTooLargeError().name).toBe("BodyTooLargeError");
    expect(__rateLimitTestHooks.maxBuckets).toBe(10_000);
  });
});
