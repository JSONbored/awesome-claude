import { afterEach, describe, expect, it, vi } from "vitest";

import { emitAiReferralEvent } from "@/components/ai-referral";

function sessionStorageStub() {
  return {
    getItem: vi.fn(),
    setItem: vi.fn(),
  };
}

describe("emitAiReferralEvent", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does not mark the session when the tracker is unavailable", () => {
    const sessionStorage = sessionStorageStub();
    vi.stubGlobal("window", {
      umami: {},
      sessionStorage,
    });

    expect(emitAiReferralEvent("chatgpt", "/")).toBe(false);
    expect(sessionStorage.setItem).not.toHaveBeenCalled();
  });

  it("marks the session after the referral event is dispatched", () => {
    const track = vi.fn();
    const sessionStorage = sessionStorageStub();
    vi.stubGlobal("window", {
      umami: { track },
      sessionStorage,
    });

    expect(emitAiReferralEvent("claude", "/agents")).toBe(true);
    expect(track).toHaveBeenCalledWith("ai-referral", {
      source: "claude",
      landing: "/agents",
    });
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      "ai-referral-tracked",
      "1",
    );
  });

  it("does not mark the session when dispatch throws", () => {
    const sessionStorage = sessionStorageStub();
    vi.stubGlobal("window", {
      umami: {
        track: vi.fn(() => {
          throw new Error("tracker failed");
        }),
      },
      sessionStorage,
    });

    expect(emitAiReferralEvent("perplexity", "/mcp")).toBe(false);
    expect(sessionStorage.setItem).not.toHaveBeenCalled();
  });
});
