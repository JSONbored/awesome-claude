import { afterEach, describe, expect, it, vi } from "vitest";

import {
  escapeDiscordMarkdown,
  sendDiscordMessage,
} from "@/lib/notify.server";

describe("Discord notifications", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("disables Discord mention parsing on webhook messages", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      sendDiscordMessage(
        "https://discord.example/webhook",
        "@everyone hello <@&123>",
      ),
    ).resolves.toBe(true);

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(String(init.body))).toEqual({
      content: "@everyone hello <@&123>",
      allowed_mentions: { parse: [] },
    });
  });

  it("escapes untrusted text before Discord markdown interpolation", () => {
    expect(escapeDiscordMarkdown("@everyone **urgent** <@&123>")).toBe(
      "@\u200beveryone \\*\\*urgent\\*\\* \\<@\u200b&123\\>",
    );
  });
});
