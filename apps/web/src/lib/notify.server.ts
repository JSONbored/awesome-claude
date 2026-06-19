// Server-only outbound notifications (Discord). Best-effort by design: a failure
// here must never block or fail the request that triggered it.

/** Escape attacker-controlled text before interpolating it into Discord markdown. */
export function escapeDiscordMarkdown(value: string): string {
  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/@/g, "@\u200b")
    .replace(/[\\`*_{}[\]()#+\-.!|>~<>]/g, "\\$&");
}

/** Post a plain message to a Discord webhook. No-ops without a URL; never throws. */
export async function sendDiscordMessage(
  webhookUrl: string,
  content: string,
): Promise<boolean> {
  if (!webhookUrl) return false;
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ content, allowed_mentions: { parse: [] } }),
      signal: AbortSignal.timeout(8000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
