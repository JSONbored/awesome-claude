import type { GateVerdict } from "./review";

export type DiscordDecisionNotification = {
  webhookUrl?: string;
  repoFullName: string;
  prNumber: number;
  prTitle?: string;
  prUrl?: string;
  author?: string;
  verdict: GateVerdict;
  category?: string;
  changedFile?: string;
  contentUrl?: string;
  ciSummary?: string;
  summary?: string;
  now?: Date;
};

export type DiscordNotificationResult =
  | { ok: true; skipped?: false; status?: number }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; skipped?: false; status?: number; reason: string };

const DISCORD_MAX_FIELD_LENGTH = 220;
const DISCORD_MAX_DESCRIPTION_LENGTH = 260;
const DISCORD_MAX_TITLE_LENGTH = 256;

const VERDICT_LABELS: Record<GateVerdict, string> = {
  merge: "Merged",
  close: "Closed",
  request_changes: "Changes requested",
  manual: "Manual review",
  ignore: "Ignored",
};

const VERDICT_ACTIONS: Record<GateVerdict, string> = {
  merge: "merged",
  close: "closed",
  request_changes: "needs changes",
  manual: "needs manual review",
  ignore: "ignored",
};

const VERDICT_COLORS: Record<GateVerdict, number> = {
  merge: 0x238636,
  close: 0xda3633,
  request_changes: 0xfb8500,
  manual: 0x8957e5,
  ignore: 0x8b949e,
};

export function truncate(value: unknown, limit: number) {
  const text = String(value || "")
    .replace(/\s+/g, " ")
    .trim();
  const codePoints = Array.from(text);
  if (codePoints.length <= limit) return text;
  return `${codePoints
    .slice(0, Math.max(0, limit - 3))
    .join("")
    .trimEnd()}...`;
}

function stripHtmlComments(value: string) {
  let output = "";
  let cursor = 0;
  while (cursor < value.length) {
    const start = value.indexOf("<!--", cursor);
    if (start === -1) {
      output += value.slice(cursor);
      break;
    }
    output += value.slice(cursor, start);
    const end = value.indexOf("-->", start + 4);
    if (end === -1) break;
    cursor = end + 3;
  }
  return output;
}

function sanitizeRationale(summary: unknown) {
  const lines = String(summary || "")
    .split(/\r?\n/)
    .map((line) =>
      stripHtmlComments(line)
        .replace(/^#{1,6}\s*/, "")
        .replace(/^[-*]\s*/, "")
        .replace(/\*\*/g, "")
        .replace(/`/g, "")
        .trim(),
    )
    .filter(Boolean)
    .filter(
      (line) =>
        !/^(summary|recommended action|required shape|source review|security review|validation review|duplicate \/ history review):?$/i.test(
          line,
        ),
    )
    .filter((line) => !/^automated review by heyclaude/i.test(line))
    .filter((line) => !/^---$/.test(line))
    .slice(0, 1);
  return truncate(lines.join(" "), DISCORD_MAX_DESCRIPTION_LENGTH);
}

function field(name: string, value: unknown, inline = true) {
  return {
    name,
    value: truncate(value || "n/a", DISCORD_MAX_FIELD_LENGTH),
    inline,
  };
}

function contentUrlFromPath(filePath: unknown, categoryHint?: unknown) {
  const match = /^content\/([a-z0-9-]+)\/([a-z0-9-]+)\.mdx$/i.exec(
    String(filePath || "").trim(),
  );
  if (!match) return "";
  const [, category, slug] = match;
  if (categoryHint && String(categoryHint) !== category) return "";
  return `https://heyclau.de/entry/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`;
}

function liveContentUrl(notification: DiscordDecisionNotification) {
  if (notification.verdict !== "merge") return "";
  const explicitUrl = String(notification.contentUrl || "").trim();
  if (explicitUrl.startsWith("https://heyclau.de/entry/")) return explicitUrl;
  return contentUrlFromPath(notification.changedFile, notification.category);
}

function compactPrSubject(title: unknown) {
  return (
    truncate(
      String(title || "")
        .replace(/^[a-z]+(?:\([^)]+\))?:\s*/i, "")
        .replace(/^(add|create|submit|update)\s+/i, "")
        .trim() || "content submission",
      120,
    ) || "content submission"
  );
}

function compactCiSummary(value: unknown) {
  const text = String(value || "").trim();
  if (!text) return "n/a";
  const parts = text
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const lower = part.toLowerCase();
      const status = lower.includes("pending")
        ? "pending"
        : lower.includes("failed") || lower.includes("failure")
          ? "failed"
          : lower.includes("neutral")
            ? "neutral, non-blocking"
            : lower.includes("passed") || lower.includes("success")
              ? "passed"
              : "reported";
      if (lower.includes("superagent")) return `Superagent ${status}`;
      if (lower.includes("validate-content")) return `Content ${status}`;
      return truncate(part, 80);
    });
  return truncate([...new Set(parts)].join(" · "), DISCORD_MAX_FIELD_LENGTH);
}

function validateDiscordWebhookUrl(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  if (
    ![
      "discord.com",
      "discordapp.com",
      "canary.discord.com",
      "ptb.discord.com",
    ].includes(url.hostname)
  ) {
    return null;
  }
  if (!url.pathname.startsWith("/api/webhooks/")) return null;
  return url.toString();
}

export function buildDiscordDecisionPayload(
  notification: DiscordDecisionNotification,
) {
  const verdictLabel = VERDICT_LABELS[notification.verdict];
  const subject = compactPrSubject(notification.prTitle);
  const contentUrl = liveContentUrl(notification);
  const fields = [
    field("Result", verdictLabel),
    field("Category", notification.category || "n/a"),
    field("Author", notification.author || "n/a"),
    field("Checks", compactCiSummary(notification.ciSummary), false),
    field("File", notification.changedFile || "n/a", false),
  ];
  if (contentUrl) {
    fields.push(field("Live", `[View content](${contentUrl})`, false));
  }

  return {
    username: "HeyClaude Maintainer Agent",
    embeds: [
      {
        title: truncate(
          `#${notification.prNumber} ${VERDICT_ACTIONS[notification.verdict]} · ${subject}`,
          DISCORD_MAX_TITLE_LENGTH,
        ),
        url:
          notification.prUrl ||
          `https://github.com/${notification.repoFullName}/pull/${notification.prNumber}`,
        color: VERDICT_COLORS[notification.verdict],
        description:
          sanitizeRationale(notification.summary) ||
          "HeyClaude submission gate completed a decision.",
        fields,
        footer: {
          text: `${notification.repoFullName} · HeyClaude submission gate`,
        },
        timestamp: (notification.now || new Date()).toISOString(),
      },
    ],
  };
}

export async function postDiscordDecisionNotification(
  notification: DiscordDecisionNotification,
  fetchImpl: typeof fetch = fetch,
): Promise<DiscordNotificationResult> {
  if (notification.verdict === "ignore") {
    return { ok: false, skipped: true, reason: "ignored_verdict" };
  }
  if (!notification.webhookUrl) {
    return { ok: false, skipped: true, reason: "not_configured" };
  }
  const webhookUrl = validateDiscordWebhookUrl(notification.webhookUrl);
  if (!webhookUrl) {
    return { ok: false, skipped: true, reason: "invalid_webhook_url" };
  }

  try {
    const response = await fetchImpl(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(buildDiscordDecisionPayload(notification)),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        reason: "discord_webhook_failed",
      };
    }
    return { ok: true, status: response.status };
  } catch {
    return { ok: false, reason: "discord_webhook_error" };
  }
}
