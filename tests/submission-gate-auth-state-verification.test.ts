import { afterEach, describe, expect, it } from "vitest";

import { verifyDraftState } from "../apps/submission-gate/src/storage";
import { sha256Hex } from "../apps/submission-gate/src/security";

function createFakeDb(first: unknown) {
  return {
    prepare() {
      return {
        bind() {
          return this;
        },
        async first() {
          return first;
        },
      };
    },
  } as unknown as D1Database;
}

describe("submission-gate verifyDraftState", () => {
  it("fails closed when the draft has no stored auth state hash", async () => {
    const db = createFakeDb({ authStateHash: null });
    await expect(verifyDraftState(db, "draft_1", "state")).resolves.toBe(false);
  });

  it("fails closed when the draft row itself is missing", async () => {
    const db = createFakeDb(null);
    await expect(verifyDraftState(db, "draft_1", "state")).resolves.toBe(false);
  });

  it("fails closed when the stored hash is not valid hex", async () => {
    const db = createFakeDb({ authStateHash: "not-hex-at-all" });
    await expect(verifyDraftState(db, "draft_1", "state")).resolves.toBe(false);
  });

  it("fails closed when the stored hash decodes to the wrong byte length", async () => {
    // Valid hex but short of the 32-byte SHA-256 digest length.
    const db = createFakeDb({ authStateHash: "abcd" });
    await expect(verifyDraftState(db, "draft_1", "state")).resolves.toBe(false);
  });

  describe("with a native crypto.subtle.timingSafeEqual available", () => {
    const subtle = crypto.subtle as SubtleCrypto & {
      timingSafeEqual?: (left: Uint8Array, right: Uint8Array) => boolean;
    };
    const original = subtle.timingSafeEqual;

    afterEach(() => {
      if (original) {
        subtle.timingSafeEqual = original;
      } else {
        delete subtle.timingSafeEqual;
      }
    });

    it("delegates to the native comparison when the runtime provides one", async () => {
      const calls: Array<[Uint8Array, Uint8Array]> = [];
      subtle.timingSafeEqual = (left, right) => {
        calls.push([left, right]);
        return true;
      };

      const authHash = await sha256Hex("expected-state");
      const db = createFakeDb({ authStateHash: authHash });

      await expect(
        verifyDraftState(db, "draft_1", "whatever-state"),
      ).resolves.toBe(true);
      expect(calls).toHaveLength(1);
      expect(calls[0][0]).toBeInstanceOf(Uint8Array);
      expect(calls[0][0]).toHaveLength(32);
    });
  });
});
