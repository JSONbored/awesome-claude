/** Tiny client helper for newsletter API routes. */
type SubscribeInput = {
  email: string;
  segments?: string[];
  source?: string;
};

export async function subscribeToNewsletter(
  input: SubscribeInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) return { ok: false, error: data.error ?? `Subscribe failed (${res.status}).` };
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Try again in a moment." };
  }
}

export async function unsubscribeFromNewsletter(input: {
  email: string;
  segments?: string[];
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/public/newsletter/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) return { ok: false, error: data.error ?? `Unsubscribe failed (${res.status}).` };
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Try again in a moment." };
  }
}
