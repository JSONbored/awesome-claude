import { describe, expect, it } from "vitest";

import {
  signBriefApproveToken,
  verifyBriefApproveToken,
} from "../apps/web/src/lib/brief-token-lib";

const SIGNING_KEY = "unit-test-brief-signing-key";

describe("brief-token-lib sign and verify", () => {
  it("round-trips approve token", async () => {
    const payload = { n: 1, p: "2026-01-01", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(1);
  });
  it("brief token matrix 0", async () => {
    const payload = { n: 1, p: "period-0", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(1);
  });
  it("brief token matrix 1", async () => {
    const payload = { n: 2, p: "period-1", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(2);
  });
  it("brief token matrix 2", async () => {
    const payload = { n: 3, p: "period-2", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(3);
  });
  it("brief token matrix 3", async () => {
    const payload = { n: 4, p: "period-3", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(4);
  });
  it("brief token matrix 4", async () => {
    const payload = { n: 5, p: "period-4", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(5);
  });
  it("brief token matrix 5", async () => {
    const payload = { n: 6, p: "period-5", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(6);
  });
  it("brief token matrix 6", async () => {
    const payload = { n: 7, p: "period-6", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(7);
  });
  it("brief token matrix 7", async () => {
    const payload = { n: 8, p: "period-7", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(8);
  });
  it("brief token matrix 8", async () => {
    const payload = { n: 9, p: "period-8", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(9);
  });
  it("brief token matrix 9", async () => {
    const payload = { n: 10, p: "period-9", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(10);
  });
  it("brief token matrix 10", async () => {
    const payload = { n: 11, p: "period-10", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(11);
  });
  it("brief token matrix 11", async () => {
    const payload = { n: 12, p: "period-11", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(12);
  });
  it("brief token matrix 12", async () => {
    const payload = { n: 13, p: "period-12", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(13);
  });
  it("brief token matrix 13", async () => {
    const payload = { n: 14, p: "period-13", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(14);
  });
  it("brief token matrix 14", async () => {
    const payload = { n: 15, p: "period-14", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(15);
  });
  it("brief token matrix 15", async () => {
    const payload = { n: 16, p: "period-15", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(16);
  });
  it("brief token matrix 16", async () => {
    const payload = { n: 17, p: "period-16", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(17);
  });
  it("brief token matrix 17", async () => {
    const payload = { n: 18, p: "period-17", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(18);
  });
  it("brief token matrix 18", async () => {
    const payload = { n: 19, p: "period-18", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(19);
  });
  it("brief token matrix 19", async () => {
    const payload = { n: 20, p: "period-19", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(20);
  });
  it("brief token matrix 20", async () => {
    const payload = { n: 21, p: "period-20", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(21);
  });
  it("brief token matrix 21", async () => {
    const payload = { n: 22, p: "period-21", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(22);
  });
  it("brief token matrix 22", async () => {
    const payload = { n: 23, p: "period-22", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(23);
  });
  it("brief token matrix 23", async () => {
    const payload = { n: 24, p: "period-23", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(24);
  });
  it("brief token matrix 24", async () => {
    const payload = { n: 25, p: "period-24", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(25);
  });
  it("brief token matrix 25", async () => {
    const payload = { n: 26, p: "period-25", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(26);
  });
  it("brief token matrix 26", async () => {
    const payload = { n: 27, p: "period-26", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(27);
  });
  it("brief token matrix 27", async () => {
    const payload = { n: 28, p: "period-27", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(28);
  });
  it("brief token matrix 28", async () => {
    const payload = { n: 29, p: "period-28", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(29);
  });
  it("brief token matrix 29", async () => {
    const payload = { n: 30, p: "period-29", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(30);
  });
  it("brief token matrix 30", async () => {
    const payload = { n: 31, p: "period-30", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(31);
  });
  it("brief token matrix 31", async () => {
    const payload = { n: 32, p: "period-31", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(32);
  });
  it("brief token matrix 32", async () => {
    const payload = { n: 33, p: "period-32", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(33);
  });
  it("brief token matrix 33", async () => {
    const payload = { n: 34, p: "period-33", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(34);
  });
  it("brief token matrix 34", async () => {
    const payload = { n: 35, p: "period-34", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(35);
  });
  it("brief token matrix 35", async () => {
    const payload = { n: 36, p: "period-35", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(36);
  });
  it("brief token matrix 36", async () => {
    const payload = { n: 37, p: "period-36", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(37);
  });
  it("brief token matrix 37", async () => {
    const payload = { n: 38, p: "period-37", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(38);
  });
  it("brief token matrix 38", async () => {
    const payload = { n: 39, p: "period-38", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(39);
  });
  it("brief token matrix 39", async () => {
    const payload = { n: 40, p: "period-39", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(40);
  });
  it("brief token matrix 40", async () => {
    const payload = { n: 41, p: "period-40", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(41);
  });
  it("brief token matrix 41", async () => {
    const payload = { n: 42, p: "period-41", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(42);
  });
  it("brief token matrix 42", async () => {
    const payload = { n: 43, p: "period-42", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(43);
  });
  it("brief token matrix 43", async () => {
    const payload = { n: 44, p: "period-43", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(44);
  });
  it("brief token matrix 44", async () => {
    const payload = { n: 45, p: "period-44", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(45);
  });
  it("brief token matrix 45", async () => {
    const payload = { n: 46, p: "period-45", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(46);
  });
  it("brief token matrix 46", async () => {
    const payload = { n: 47, p: "period-46", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(47);
  });
  it("brief token matrix 47", async () => {
    const payload = { n: 48, p: "period-47", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(48);
  });
  it("brief token matrix 48", async () => {
    const payload = { n: 49, p: "period-48", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(49);
  });
  it("brief token matrix 49", async () => {
    const payload = { n: 50, p: "period-49", exp: Date.now() + 60_000 };
    const signed = await signBriefApproveToken(SIGNING_KEY, payload);
    const verified = await verifyBriefApproveToken(
      SIGNING_KEY,
      signed,
      Date.now(),
    );
    expect(verified?.n).toBe(50);
  });
});

describe("brief-token-lib verifyBriefApproveToken rejections", () => {
  const FUTURE = 4102444800000; // 2100-01-01, safely unexpired
  const NOW = 1_700_000_000_000;

  // Re-implements the lib's base64url + HMAC so we can forge a token whose
  // signature is valid but whose body does not decode to JSON.
  function base64url(bytes: Uint8Array): string {
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
  async function hmacBase64url(
    secret: string,
    message: string,
  ): Promise<string> {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
    return base64url(new Uint8Array(sig));
  }

  it("rejects an empty secret or a non-string token", async () => {
    const token = await signBriefApproveToken(SIGNING_KEY, {
      n: 1,
      p: "p",
      exp: FUTURE,
    });
    expect(await verifyBriefApproveToken("", token, NOW)).toBeNull();
    expect(
      await verifyBriefApproveToken(SIGNING_KEY, 123 as unknown as string, NOW),
    ).toBeNull();
  });

  it("rejects tokens without a usable separator", async () => {
    expect(
      await verifyBriefApproveToken(SIGNING_KEY, "nodothere", NOW),
    ).toBeNull();
    expect(
      await verifyBriefApproveToken(SIGNING_KEY, ".leading", NOW),
    ).toBeNull();
    expect(
      await verifyBriefApproveToken(SIGNING_KEY, "trailing.", NOW),
    ).toBeNull();
  });

  it("rejects a signature of the wrong length", async () => {
    const token = await signBriefApproveToken(SIGNING_KEY, {
      n: 1,
      p: "p",
      exp: FUTURE,
    });
    const body = token.slice(0, token.indexOf("."));
    expect(
      await verifyBriefApproveToken(SIGNING_KEY, `${body}.AAAA`, NOW),
    ).toBeNull();
  });

  it("rejects a signature that is not valid base64url", async () => {
    const token = await signBriefApproveToken(SIGNING_KEY, {
      n: 1,
      p: "p",
      exp: FUTURE,
    });
    const body = token.slice(0, token.indexOf("."));
    expect(
      await verifyBriefApproveToken(SIGNING_KEY, `${body}.@@@@`, NOW),
    ).toBeNull();
  });

  it("rejects a validly-signed token whose body is not JSON", async () => {
    const body = base64url(new TextEncoder().encode("not-json"));
    const sig = await hmacBase64url(SIGNING_KEY, body);
    expect(
      await verifyBriefApproveToken(SIGNING_KEY, `${body}.${sig}`, NOW),
    ).toBeNull();
  });

  it("rejects an expired token", async () => {
    const token = await signBriefApproveToken(SIGNING_KEY, {
      n: 1,
      p: "p",
      exp: 1000,
    });
    expect(await verifyBriefApproveToken(SIGNING_KEY, token, NOW)).toBeNull();
  });

  it("rejects payloads with the wrong field types", async () => {
    const badN = await signBriefApproveToken(SIGNING_KEY, {
      n: "one",
      p: "p",
      exp: FUTURE,
    } as unknown as { n: number; p: string; exp: number });
    const badP = await signBriefApproveToken(SIGNING_KEY, {
      n: 1,
      p: 5,
      exp: FUTURE,
    } as unknown as { n: number; p: string; exp: number });
    const badExp = await signBriefApproveToken(SIGNING_KEY, {
      n: 1,
      p: "p",
      exp: "soon",
    } as unknown as { n: number; p: string; exp: number });
    expect(await verifyBriefApproveToken(SIGNING_KEY, badN, NOW)).toBeNull();
    expect(await verifyBriefApproveToken(SIGNING_KEY, badP, NOW)).toBeNull();
    expect(await verifyBriefApproveToken(SIGNING_KEY, badExp, NOW)).toBeNull();
  });
});
