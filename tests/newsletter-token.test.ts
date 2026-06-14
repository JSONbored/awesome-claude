import { describe, expect, it } from "vitest";

import {
  signConfirmToken,
  verifyConfirmToken,
  type NewsletterConfirmPayload,
} from "../apps/web/src/lib/newsletter-token.server";

const SECRET = "test-confirm-secret-please-rotate";
const NOW = 1_750_000_000_000;

function payload(overrides: Partial<NewsletterConfirmPayload> = {}): NewsletterConfirmPayload {
  return {
    email: "reader@example.com",
    segments: ["mcp", "agents"],
    source: "inline",
    exp: NOW + 60_000,
    ...overrides,
  };
}

describe("newsletter confirm tokens", () => {
  it("round-trips a signed payload", async () => {
    const token = await signConfirmToken(SECRET, payload());
    const verified = await verifyConfirmToken(SECRET, token, NOW);
    expect(verified).toMatchObject({
      email: "reader@example.com",
      segments: ["mcp", "agents"],
      source: "inline",
    });
  });

  it("rejects an expired token", async () => {
    const token = await signConfirmToken(SECRET, payload({ exp: NOW - 1 }));
    expect(await verifyConfirmToken(SECRET, token, NOW)).toBeNull();
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await signConfirmToken(SECRET, payload());
    expect(await verifyConfirmToken("a-different-secret", token, NOW)).toBeNull();
  });

  it("rejects a tampered payload body", async () => {
    const token = await signConfirmToken(SECRET, payload());
    const [, sig] = token.split(".");
    const forged = Buffer.from(JSON.stringify(payload({ email: "attacker@evil.com" })))
      .toString("base64url");
    expect(await verifyConfirmToken(SECRET, `${forged}.${sig}`, NOW)).toBeNull();
  });

  it("rejects a tampered signature", async () => {
    const token = await signConfirmToken(SECRET, payload());
    const [body] = token.split(".");
    expect(await verifyConfirmToken(SECRET, `${body}.AAAA`, NOW)).toBeNull();
  });

  it("rejects malformed tokens", async () => {
    expect(await verifyConfirmToken(SECRET, "not-a-token", NOW)).toBeNull();
    expect(await verifyConfirmToken(SECRET, "", NOW)).toBeNull();
    expect(await verifyConfirmToken(SECRET, ".", NOW)).toBeNull();
    expect(await verifyConfirmToken("", "a.b", NOW)).toBeNull();
  });
});
