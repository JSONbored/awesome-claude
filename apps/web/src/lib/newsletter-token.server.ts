// Stateless double-opt-in confirmation tokens.
//
// A confirmation link must prove "this email asked to subscribe" without a
// database row, so we sign the pending payload with HMAC-SHA256 (Web Crypto,
// available in both the Cloudflare Worker runtime and Node test env). The token
// is `base64url(payload).base64url(hmac)`; verification recomputes the HMAC,
// compares in constant time, and enforces the embedded expiry.
//
// Server-only (the `.server` suffix keeps the signing secret out of the client
// bundle via the serverOnlyClientStubs vite plugin).

const encoder = new TextEncoder();

function base64urlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacSha256(secret: string, message: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return new Uint8Array(signature);
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

export type NewsletterConfirmPayload = {
  /** Lowercased subscriber email. */
  email: string;
  /** Follow/segment ids to add on confirm (besides the default audience). */
  segments: string[];
  /** Where the signup happened, for attribution. */
  source: string;
  /** Expiry as a unix-ms timestamp. */
  exp: number;
};

/** Sign a pending-subscription payload into a self-verifying confirm token. */
export async function signConfirmToken(
  secret: string,
  payload: NewsletterConfirmPayload,
): Promise<string> {
  const body = base64urlEncode(encoder.encode(JSON.stringify(payload)));
  const signature = base64urlEncode(await hmacSha256(secret, body));
  return `${body}.${signature}`;
}

/**
 * Verify a confirm token and return its payload, or null if the signature is
 * invalid, the token is malformed, or it has expired (`now` is unix-ms).
 */
export async function verifyConfirmToken(
  secret: string,
  token: string,
  now: number,
): Promise<NewsletterConfirmPayload | null> {
  if (!secret || typeof token !== "string") return null;
  const dot = token.indexOf(".");
  if (dot <= 0 || dot === token.length - 1) return null;

  const body = token.slice(0, dot);
  const providedSig = token.slice(dot + 1);

  let expectedSig: Uint8Array;
  let providedBytes: Uint8Array;
  try {
    expectedSig = await hmacSha256(secret, body);
    providedBytes = base64urlDecode(providedSig);
  } catch {
    return null;
  }
  if (!timingSafeEqual(expectedSig, providedBytes)) return null;

  let payload: NewsletterConfirmPayload;
  try {
    payload = JSON.parse(new TextDecoder().decode(base64urlDecode(body))) as NewsletterConfirmPayload;
  } catch {
    return null;
  }

  if (
    !payload ||
    typeof payload.email !== "string" ||
    !payload.email ||
    typeof payload.exp !== "number" ||
    !Array.isArray(payload.segments)
  ) {
    return null;
  }
  if (typeof payload.source !== "string") payload.source = "newsletter";
  if (now > payload.exp) return null;

  return payload;
}
