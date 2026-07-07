import { afterEach, describe, expect, it, vi } from "vitest";
import { recordIntentEvent } from "@/lib/intent-event-client";

describe("intent event client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("records intent events with normalized entry keys and degrades safely", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ stored: true }),
      })
      .mockRejectedValueOnce(new Error("offline"));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      recordIntentEvent("install", { category: "skills", slug: "demo" }),
    ).resolves.toBe(true);
    expect(fetchMock).toHaveBeenCalledWith("/api/intent-events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "install", entryKey: "skills:demo" }),
    });

    await expect(
      recordIntentEvent("open", { category: "skills", slug: "demo" }),
    ).resolves.toBe(false);
  });

  it("rejects invalid entry keys before calling the network", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      recordIntentEvent("copy", { category: "Skills", slug: "Bad Slug!" }),
    ).resolves.toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
