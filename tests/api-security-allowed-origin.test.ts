import { describe, expect, it } from "vitest";

import { isAllowedOrigin } from "@/lib/api-security";

const requestWithOrigin = (origin?: string) =>
  new Request(
    "https://heyclau.de/api/test",
    origin ? { headers: { origin } } : {},
  );

describe("isAllowedOrigin", () => {
  it("allows requests with no Origin header (same-origin / non-CORS)", () => {
    // A missing Origin is not a cross-site request, so it is permitted.
    expect(isAllowedOrigin(requestWithOrigin())).toBe(true);
  });

  it("allows the production, dev, preview, and local origins", () => {
    expect(isAllowedOrigin(requestWithOrigin("https://heyclau.de"))).toBe(true);
    expect(isAllowedOrigin(requestWithOrigin("https://dev.heyclau.de"))).toBe(
      true,
    );
    expect(
      isAllowedOrigin(requestWithOrigin("https://pr-123.zeronode.workers.dev")),
    ).toBe(true);
    expect(isAllowedOrigin(requestWithOrigin("http://localhost:3000"))).toBe(
      true,
    );
    expect(isAllowedOrigin(requestWithOrigin("http://127.0.0.1:8788"))).toBe(
      true,
    );
  });

  it("rejects unrelated origins", () => {
    expect(isAllowedOrigin(requestWithOrigin("https://evil.com"))).toBe(false);
  });

  it("requires https for the production host (no plaintext downgrade)", () => {
    // The allow-list pins https for heyclau.de, so a plaintext origin fails.
    expect(isAllowedOrigin(requestWithOrigin("http://heyclau.de"))).toBe(false);
  });

  it("rejects look-alike hosts that only suffix the allowed domain", () => {
    // Patterns are anchored, so `heyclau.de.evil.com` must not match.
    expect(
      isAllowedOrigin(requestWithOrigin("https://heyclau.de.evil.com")),
    ).toBe(false);
  });
});
