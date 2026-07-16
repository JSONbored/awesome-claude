import { describe, expect, it } from "vitest";

import {
  signBriefApproveToken,
  verifyBriefApproveToken,
} from "../apps/web/src/lib/brief-token-lib";

const SECRET = "brief-signing-secret";
const NOW = 1_800_000_000_000;

const payload = { n: 42, p: "2026-05-17", exp: NOW + 60_000 };

describe("brief-token-lib round trip", () => {
  it("verifies a freshly signed token", async () => {
    const token = await signBriefApproveToken(SECRET, payload);
    expect(await verifyBriefApproveToken(SECRET, token, NOW)).toEqual(payload);
  });
});

describe("brief-token-lib rejects malformed input", () => {
  it("rejects a missing secret", async () => {
    const token = await signBriefApproveToken(SECRET, payload);
    expect(await verifyBriefApproveToken("", token, NOW)).toBeNull();
  });

  it("rejects a non-string token", async () => {
    expect(
      await verifyBriefApproveToken(SECRET, undefined as never, NOW),
    ).toBeNull();
  });

  it("rejects tokens without a usable body/signature split", async () => {
    expect(await verifyBriefApproveToken(SECRET, "nodot", NOW)).toBeNull();
    expect(
      await verifyBriefApproveToken(SECRET, ".leadingdot", NOW),
    ).toBeNull();
    expect(
      await verifyBriefApproveToken(SECRET, "trailingdot.", NOW),
    ).toBeNull();
  });
});

describe("brief-token-lib rejects tampered tokens", () => {
  it("rejects a token signed with a different secret", async () => {
    const token = await signBriefApproveToken("other-secret", payload);
    expect(await verifyBriefApproveToken(SECRET, token, NOW)).toBeNull();
  });

  it("rejects a truncated signature", async () => {
    const token = await signBriefApproveToken(SECRET, payload);
    const [body, sig] = token.split(".");
    expect(
      await verifyBriefApproveToken(SECRET, `${body}.${sig.slice(0, 8)}`, NOW),
    ).toBeNull();
  });

  it("rejects a tampered payload body", async () => {
    const token = await signBriefApproveToken(SECRET, payload);
    const sig = token.split(".")[1];
    const forgedBody = await signBriefApproveToken(SECRET, {
      ...payload,
      n: 99,
    });
    expect(
      await verifyBriefApproveToken(
        SECRET,
        `${forgedBody.split(".")[0]}.${sig}`,
        NOW,
      ),
    ).toBeNull();
  });
});

describe("brief-token-lib rejects invalid payloads", () => {
  it("rejects an expired token", async () => {
    const token = await signBriefApproveToken(SECRET, {
      ...payload,
      exp: NOW - 1,
    });
    expect(await verifyBriefApproveToken(SECRET, token, NOW)).toBeNull();
  });

  it("rejects payloads with missing or mistyped fields", async () => {
    const missingIssue = await signBriefApproveToken(SECRET, {
      p: "2026-05-17",
      exp: NOW + 60_000,
    } as never);
    expect(await verifyBriefApproveToken(SECRET, missingIssue, NOW)).toBeNull();

    const mistypedPeriod = await signBriefApproveToken(SECRET, {
      n: 1,
      p: 20260517,
      exp: NOW + 60_000,
    } as never);
    expect(
      await verifyBriefApproveToken(SECRET, mistypedPeriod, NOW),
    ).toBeNull();

    const missingExpiry = await signBriefApproveToken(SECRET, {
      n: 1,
      p: "2026-05-17",
    } as never);
    expect(
      await verifyBriefApproveToken(SECRET, missingExpiry, NOW),
    ).toBeNull();
  });
});
