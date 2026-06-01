/** Tiny client helper for newsletter API routes. */
type SubscribeInput = {
  email: string;
  segments?: string[];
  source?: string;
};

type ApiErrorBody = {
  error?: string | { message?: unknown };
};

function responseErrorMessage(data: unknown, fallback: string) {
  if (data && typeof data === "object" && "error" in data) {
    const error = (data as ApiErrorBody).error;
    if (typeof error === "string" && error.length > 0) return error;
    if (error && typeof error === "object" && typeof error.message === "string") {
      return error.message;
    }
  }
  return fallback;
}

export async function subscribeToNewsletter(
  input: SubscribeInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: responseErrorMessage(data, `Subscribe failed (${res.status}).`) };
    }
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
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        error: responseErrorMessage(data, `Unsubscribe failed (${res.status}).`),
      };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Try again in a moment." };
  }
}
