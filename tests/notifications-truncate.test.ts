import { describe, expect, it } from "vitest";

import {
  buildDiscordDecisionPayload,
  postDiscordDecisionNotification,
  truncate,
} from "../apps/submission-gate/src/notifications";

// Discord embed caps the submission gate stays within (matching the
// DISCORD_MAX_* constants in notifications.ts): field value 220, title 256,
// description 260.
const CAPS = [220, 256, 260];

describe("notifications truncate", () => {
  it("keeps results within the requested cap and appends an ellipsis", () => {
    for (const cap of CAPS) {
      const result = truncate("x".repeat(cap + 50), cap);
      expect(result.length, `cap ${cap}`).toBeLessThanOrEqual(cap);
      expect(result.endsWith("..."), `cap ${cap}`).toBe(true);
    }
  });

  it("returns inputs at or below the cap unchanged", () => {
    expect(truncate("#700 closed · useful guide", 256)).toBe(
      "#700 closed · useful guide",
    );
    expect(truncate("", 220)).toBe("");
  });

  it("does not split a surrogate pair at the truncation boundary", () => {
    for (const cap of CAPS) {
      // Position a non-BMP emoji so its surrogate pair straddles the cut point;
      // a UTF-16 slice would leave a lone surrogate here.
      const input = `${"a".repeat(cap - 2)}😀tail`;
      const result = truncate(input, cap);
      expect(result.length, `cap ${cap}`).toBeLessThanOrEqual(cap);
      expect(result, `cap ${cap}`).not.toContain("�");
      // A lone surrogate makes encodeURIComponent throw a URIError.
      expect(() => encodeURIComponent(result), `cap ${cap}`).not.toThrow();
    }
  });

  it("measures the cap by code point, not UTF-16 unit", () => {
    // 10 emoji = 20 UTF-16 units but 10 code points, so a cap of 12 keeps them
    // intact instead of slicing through a surrogate pair.
    const tenEmoji = "😀".repeat(10);
    expect(truncate(tenEmoji, 12)).toBe(tenEmoji);
  });

  it("builds compact Discord decision payloads with sanitized rationale and live links", () => {
    const payload = buildDiscordDecisionPayload({
      repoFullName: "JSONbored/awesome-claude",
      prNumber: 123,
      prTitle: "content(mcp): add useful server",
      prUrl: "",
      author: "@contributor",
      verdict: "merge",
      category: "mcp",
      changedFile: "content/mcp/useful-server.mdx",
      ciSummary:
        "validate-content passed; Superagent neutral; coverage pending; other check failed",
      summary: [
        "<!-- hidden -->",
        "## Summary",
        "- **Accepted** because source review passed.",
        "---",
        "Automated review by HeyClaude Maintainer Agent.",
      ].join("\n"),
      now: new Date("2026-01-01T00:00:00.000Z"),
    });

    const embed = payload.embeds[0];
    expect(embed.title).toContain("#123 merged · useful server");
    expect(embed.url).toBe(
      "https://github.com/JSONbored/awesome-claude/pull/123",
    );
    expect(embed.description).toBe("Accepted because source review passed.");
    expect(embed.fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Result", value: "Merged" }),
        expect.objectContaining({
          name: "Checks",
          value: expect.stringContaining("Content passed"),
        }),
        expect.objectContaining({
          name: "Live",
          value: "[View content](https://heyclau.de/entry/mcp/useful-server)",
        }),
      ]),
    );

    expect(
      buildDiscordDecisionPayload({
        repoFullName: "JSONbored/awesome-claude",
        prNumber: 124,
        verdict: "close",
        category: "skills",
        changedFile: "content/mcp/mismatch.mdx",
        summary: "",
      }).embeds[0].fields.map((field) => field.name),
    ).not.toContain("Live");
  });

  it("posts Discord decision notifications as best-effort side effects", async () => {
    const base = {
      webhookUrl: "https://discord.com/api/webhooks/123/token",
      repoFullName: "JSONbored/awesome-claude",
      prNumber: 125,
      verdict: "manual" as const,
    };

    await expect(
      postDiscordDecisionNotification({ ...base, verdict: "ignore" }),
    ).resolves.toEqual({
      ok: false,
      skipped: true,
      reason: "ignored_verdict",
    });
    await expect(
      postDiscordDecisionNotification({ ...base, webhookUrl: "" }),
    ).resolves.toEqual({
      ok: false,
      skipped: true,
      reason: "not_configured",
    });
    await expect(
      postDiscordDecisionNotification({
        ...base,
        webhookUrl: "http://discord.com/api/webhooks/123/token",
      }),
    ).resolves.toEqual({
      ok: false,
      skipped: true,
      reason: "invalid_webhook_url",
    });

    await expect(
      postDiscordDecisionNotification(
        base,
        async () => new Response("bad", { status: 500 }),
      ),
    ).resolves.toMatchObject({
      ok: false,
      status: 500,
      reason: "discord_webhook_failed",
    });
    await expect(
      postDiscordDecisionNotification(base, async () => {
        throw new Error("offline");
      }),
    ).resolves.toMatchObject({
      ok: false,
      reason: "discord_webhook_error",
    });
    await expect(
      postDiscordDecisionNotification(base, async (url, init) => {
        expect(url).toBe(base.webhookUrl);
        expect(JSON.parse(String(init?.body)).username).toBe(
          "HeyClaude Maintainer Agent",
        );
        return new Response(null, { status: 204 });
      }),
    ).resolves.toEqual({ ok: true, status: 204 });
  });
});
