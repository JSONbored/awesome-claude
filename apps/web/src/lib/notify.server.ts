// Server-only outbound notifications (Discord). Best-effort by design: a failure
// here must never block or fail the request that triggered it.

/** Post a plain message to a Discord webhook. No-ops without a URL; never throws. */
export async function sendDiscordMessage(webhookUrl: string, content: string): Promise<boolean> {
  if (!webhookUrl) return false;
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ content }),
      signal: AbortSignal.timeout(8000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
