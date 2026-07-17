import { describe, expect, it } from "vitest";

import { postDiscordDecisionNotification } from "../apps/submission-gate/src/notifications";

const base = {
  repoFullName: "JSONbored/awesome-claude",
  prNumber: 200,
  verdict: "manual" as const,
};

describe("submission-gate discord webhook url validation", () => {
  it("skips unparsable webhook urls instead of throwing", async () => {
    await expect(
      postDiscordDecisionNotification({
        ...base,
        webhookUrl: "not a url",
      }),
    ).resolves.toEqual({
      ok: false,
      skipped: true,
      reason: "invalid_webhook_url",
    });
  });

  it("skips webhook hosts outside the Discord allowlist", async () => {
    await expect(
      postDiscordDecisionNotification({
        ...base,
        webhookUrl: "https://evil.example/api/webhooks/123/token",
      }),
    ).resolves.toEqual({
      ok: false,
      skipped: true,
      reason: "invalid_webhook_url",
    });

    await expect(
      postDiscordDecisionNotification({
        ...base,
        webhookUrl: "https://discord.com.evil.example/api/webhooks/123/token",
      }),
    ).resolves.toEqual({
      ok: false,
      skipped: true,
      reason: "invalid_webhook_url",
    });
  });

  it("skips discord hosts missing the webhooks path prefix", async () => {
    await expect(
      postDiscordDecisionNotification({
        ...base,
        webhookUrl: "https://discord.com/not-a-webhook",
      }),
    ).resolves.toEqual({
      ok: false,
      skipped: true,
      reason: "invalid_webhook_url",
    });
  });

  it("accepts every allowlisted Discord hostname", async () => {
    const hosts = [
      "discord.com",
      "discordapp.com",
      "canary.discord.com",
      "ptb.discord.com",
    ];

    for (const host of hosts) {
      await expect(
        postDiscordDecisionNotification(
          { ...base, webhookUrl: `https://${host}/api/webhooks/123/token` },
          async () => new Response(null, { status: 204 }),
        ),
        `host ${host}`,
      ).resolves.toEqual({ ok: true, status: 204 });
    }
  });
});
