import { describe, expect, it } from "vitest";

import {
  signConfirmToken,
  verifyConfirmToken,
} from "../apps/web/src/lib/newsletter-token-lib";

const SIGNING_KEY = "unit-test-newsletter-signing-key";

describe("newsletter-token-lib sign and verify", () => {
  it("round-trips confirm token", async () => {
    const payload = {
      email: "user@example.com",
      segments: [],
      source: "test",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user@example.com");
  });
  it("newsletter token matrix 0", async () => {
    const payload = {
      email: "user0@example.com",
      segments: ["s0"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user0@example.com");
  });
  it("newsletter token matrix 1", async () => {
    const payload = {
      email: "user1@example.com",
      segments: ["s1"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user1@example.com");
  });
  it("newsletter token matrix 2", async () => {
    const payload = {
      email: "user2@example.com",
      segments: ["s2"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user2@example.com");
  });
  it("newsletter token matrix 3", async () => {
    const payload = {
      email: "user3@example.com",
      segments: ["s3"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user3@example.com");
  });
  it("newsletter token matrix 4", async () => {
    const payload = {
      email: "user4@example.com",
      segments: ["s4"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user4@example.com");
  });
  it("newsletter token matrix 5", async () => {
    const payload = {
      email: "user5@example.com",
      segments: ["s5"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user5@example.com");
  });
  it("newsletter token matrix 6", async () => {
    const payload = {
      email: "user6@example.com",
      segments: ["s6"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user6@example.com");
  });
  it("newsletter token matrix 7", async () => {
    const payload = {
      email: "user7@example.com",
      segments: ["s7"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user7@example.com");
  });
  it("newsletter token matrix 8", async () => {
    const payload = {
      email: "user8@example.com",
      segments: ["s8"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user8@example.com");
  });
  it("newsletter token matrix 9", async () => {
    const payload = {
      email: "user9@example.com",
      segments: ["s9"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user9@example.com");
  });
  it("newsletter token matrix 10", async () => {
    const payload = {
      email: "user10@example.com",
      segments: ["s10"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user10@example.com");
  });
  it("newsletter token matrix 11", async () => {
    const payload = {
      email: "user11@example.com",
      segments: ["s11"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user11@example.com");
  });
  it("newsletter token matrix 12", async () => {
    const payload = {
      email: "user12@example.com",
      segments: ["s12"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user12@example.com");
  });
  it("newsletter token matrix 13", async () => {
    const payload = {
      email: "user13@example.com",
      segments: ["s13"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user13@example.com");
  });
  it("newsletter token matrix 14", async () => {
    const payload = {
      email: "user14@example.com",
      segments: ["s14"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user14@example.com");
  });
  it("newsletter token matrix 15", async () => {
    const payload = {
      email: "user15@example.com",
      segments: ["s15"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user15@example.com");
  });
  it("newsletter token matrix 16", async () => {
    const payload = {
      email: "user16@example.com",
      segments: ["s16"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user16@example.com");
  });
  it("newsletter token matrix 17", async () => {
    const payload = {
      email: "user17@example.com",
      segments: ["s17"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user17@example.com");
  });
  it("newsletter token matrix 18", async () => {
    const payload = {
      email: "user18@example.com",
      segments: ["s18"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user18@example.com");
  });
  it("newsletter token matrix 19", async () => {
    const payload = {
      email: "user19@example.com",
      segments: ["s19"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user19@example.com");
  });
  it("newsletter token matrix 20", async () => {
    const payload = {
      email: "user20@example.com",
      segments: ["s20"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user20@example.com");
  });
  it("newsletter token matrix 21", async () => {
    const payload = {
      email: "user21@example.com",
      segments: ["s21"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user21@example.com");
  });
  it("newsletter token matrix 22", async () => {
    const payload = {
      email: "user22@example.com",
      segments: ["s22"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user22@example.com");
  });
  it("newsletter token matrix 23", async () => {
    const payload = {
      email: "user23@example.com",
      segments: ["s23"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user23@example.com");
  });
  it("newsletter token matrix 24", async () => {
    const payload = {
      email: "user24@example.com",
      segments: ["s24"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user24@example.com");
  });
  it("newsletter token matrix 25", async () => {
    const payload = {
      email: "user25@example.com",
      segments: ["s25"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user25@example.com");
  });
  it("newsletter token matrix 26", async () => {
    const payload = {
      email: "user26@example.com",
      segments: ["s26"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user26@example.com");
  });
  it("newsletter token matrix 27", async () => {
    const payload = {
      email: "user27@example.com",
      segments: ["s27"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user27@example.com");
  });
  it("newsletter token matrix 28", async () => {
    const payload = {
      email: "user28@example.com",
      segments: ["s28"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user28@example.com");
  });
  it("newsletter token matrix 29", async () => {
    const payload = {
      email: "user29@example.com",
      segments: ["s29"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user29@example.com");
  });
  it("newsletter token matrix 30", async () => {
    const payload = {
      email: "user30@example.com",
      segments: ["s30"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user30@example.com");
  });
  it("newsletter token matrix 31", async () => {
    const payload = {
      email: "user31@example.com",
      segments: ["s31"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user31@example.com");
  });
  it("newsletter token matrix 32", async () => {
    const payload = {
      email: "user32@example.com",
      segments: ["s32"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user32@example.com");
  });
  it("newsletter token matrix 33", async () => {
    const payload = {
      email: "user33@example.com",
      segments: ["s33"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user33@example.com");
  });
  it("newsletter token matrix 34", async () => {
    const payload = {
      email: "user34@example.com",
      segments: ["s34"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user34@example.com");
  });
  it("newsletter token matrix 35", async () => {
    const payload = {
      email: "user35@example.com",
      segments: ["s35"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user35@example.com");
  });
  it("newsletter token matrix 36", async () => {
    const payload = {
      email: "user36@example.com",
      segments: ["s36"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user36@example.com");
  });
  it("newsletter token matrix 37", async () => {
    const payload = {
      email: "user37@example.com",
      segments: ["s37"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user37@example.com");
  });
  it("newsletter token matrix 38", async () => {
    const payload = {
      email: "user38@example.com",
      segments: ["s38"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user38@example.com");
  });
  it("newsletter token matrix 39", async () => {
    const payload = {
      email: "user39@example.com",
      segments: ["s39"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user39@example.com");
  });
  it("newsletter token matrix 40", async () => {
    const payload = {
      email: "user40@example.com",
      segments: ["s40"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user40@example.com");
  });
  it("newsletter token matrix 41", async () => {
    const payload = {
      email: "user41@example.com",
      segments: ["s41"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user41@example.com");
  });
  it("newsletter token matrix 42", async () => {
    const payload = {
      email: "user42@example.com",
      segments: ["s42"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user42@example.com");
  });
  it("newsletter token matrix 43", async () => {
    const payload = {
      email: "user43@example.com",
      segments: ["s43"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user43@example.com");
  });
  it("newsletter token matrix 44", async () => {
    const payload = {
      email: "user44@example.com",
      segments: ["s44"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user44@example.com");
  });
  it("newsletter token matrix 45", async () => {
    const payload = {
      email: "user45@example.com",
      segments: ["s45"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user45@example.com");
  });
  it("newsletter token matrix 46", async () => {
    const payload = {
      email: "user46@example.com",
      segments: ["s46"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user46@example.com");
  });
  it("newsletter token matrix 47", async () => {
    const payload = {
      email: "user47@example.com",
      segments: ["s47"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user47@example.com");
  });
  it("newsletter token matrix 48", async () => {
    const payload = {
      email: "user48@example.com",
      segments: ["s48"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user48@example.com");
  });
  it("newsletter token matrix 49", async () => {
    const payload = {
      email: "user49@example.com",
      segments: ["s49"],
      source: "matrix",
      exp: Date.now() + 60_000,
    };
    const signed = await signConfirmToken(SIGNING_KEY, payload);
    const verified = await verifyConfirmToken(SIGNING_KEY, signed, Date.now());
    expect(verified?.email).toBe("user49@example.com");
  });
});
