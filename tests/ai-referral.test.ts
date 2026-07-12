import { afterEach, describe, expect, it, vi } from "vitest";

import {
  emitAiReferralEvent,
  shouldWaitForAiReferralLoad,
} from "@/components/ai-referral";

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
      surface: "ai-referral",
      landingSegment: "agents",
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

  it("only waits for load while the document is still loading", () => {
    vi.stubGlobal("document", { readyState: "loading" });
    expect(shouldWaitForAiReferralLoad()).toBe(true);

    vi.stubGlobal("document", { readyState: "interactive" });
    expect(shouldWaitForAiReferralLoad()).toBe(true);

    vi.stubGlobal("document", { readyState: "complete" });
    expect(shouldWaitForAiReferralLoad()).toBe(false);
  });
});
