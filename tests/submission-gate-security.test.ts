import { afterEach, describe, expect, it, vi } from "vitest";

import {
  base64UrlDecode,
  base64UrlEncode,
  decryptText,
  encryptText,
  randomToken,
  sha256Hex,
  signInternalPayload,
  timingSafeEqual,
  verifyGitHubWebhookSignature,
  verifyInternalSignature,
} from "../apps/submission-gate/src/security";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("submission gate security helpers", () => {
  it("round-trips base64url tokens and compares strings without length leaks", () => {
    const encoded = base64UrlEncode("hello?/=");
    expect(encoded).not.toMatch(/[+/=]/);
    expect(new TextDecoder().decode(base64UrlDecode(encoded))).toBe("hello?/=");

    expect(timingSafeEqual("same", "same")).toBe(true);
    expect(timingSafeEqual("same", "size")).toBe(false);
    expect(timingSafeEqual("short", "longer")).toBe(false);

    const subtle = crypto.subtle as SubtleCrypto & {
      timingSafeEqual?: (left: Uint8Array, right: Uint8Array) => boolean;
    };
    const original = subtle.timingSafeEqual;
    subtle.timingSafeEqual = vi.fn(() => true);
    try {
      expect(timingSafeEqual("abcd", "wxyz")).toBe(true);
      expect(subtle.timingSafeEqual).toHaveBeenCalled();
    } finally {
      if (original) subtle.timingSafeEqual = original;
      else delete subtle.timingSafeEqual;
    }
  });

  it("signs and verifies webhook/internal payloads while rejecting malformed headers", async () => {
    const payload = JSON.stringify({ action: "opened", number: 1 });
    const signature = await signInternalPayload("secret", payload);

    await expect(sha256Hex(payload)).resolves.toHaveLength(64);
    await expect(
      verifyGitHubWebhookSignature({
        secret: "secret",
        payload,
        signatureHeader: signature,
      }),
    ).resolves.toBe(true);
    await expect(
      verifyGitHubWebhookSignature({
        secret: "",
        payload,
        signatureHeader: signature,
      }),
    ).resolves.toBe(false);
    await expect(
      verifyGitHubWebhookSignature({
        secret: "secret",
        payload,
        signatureHeader: "sha1=legacy",
      }),
    ).resolves.toBe(false);
    await expect(
      verifyInternalSignature({
        secret: "secret",
        payload,
        signatureHeader: signature,
      }),
    ).resolves.toBe(true);
    await expect(
      verifyInternalSignature({
        secret: "secret",
        payload: `${payload}\n`,
        signatureHeader: signature,
      }),
    ).resolves.toBe(false);
  });

  it("encrypts user tokens and rejects malformed or tampered ciphertext", async () => {
    const encrypted = await encryptText("secret", "github-user-token");
    expect(encrypted.split(".")).toHaveLength(3);
    await expect(decryptText("secret", encrypted)).resolves.toBe(
      "github-user-token",
    );
    await expect(decryptText("secret", "missing.parts")).rejects.toThrow(
      "Invalid encrypted payload",
    );
    await expect(decryptText("secret", "a..b")).rejects.toThrow(
      "Invalid encrypted payload",
    );

    const tampered = `${encrypted.slice(0, -1)}${
      encrypted.endsWith("A") ? "B" : "A"
    }`;
    await expect(decryptText("secret", tampered)).rejects.toThrow(
      "Invalid encrypted payload",
    );

    const token = randomToken(12);
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
  });
});
