// Self-contained HMAC-SHA256 signing for Weekly Brief approval links. The link
// is emailed only to the maintainer, so a valid, unexpired signature is the
// authorization to approve + schedule an issue. Uses Web Crypto so it runs in
// the Cloudflare Worker runtime.

export type BriefApprovePayload = {
  /** issue number */
  n: number;
  /** period_through (binds the token to a specific issue snapshot) */
  p: string;
  /** unix-ms expiry */
  exp: number;
};

const encoder = new TextEncoder();

function base64urlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmac(secret: string, message: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return new Uint8Array(sig);
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function signBriefApproveToken(
  secret: string,
  payload: BriefApprovePayload,
): Promise<string> {
  const body = base64urlEncode(encoder.encode(JSON.stringify(payload)));
  const sig = base64urlEncode(await hmac(secret, body));
  return `${body}.${sig}`;
}

export async function verifyBriefApproveToken(
  secret: string,
  token: string,
  now: number,
): Promise<BriefApprovePayload | null> {
  if (!secret || typeof token !== "string") return null;
  const dot = token.indexOf(".");
  if (dot <= 0 || dot === token.length - 1) return null;
  const body = token.slice(0, dot);
  const providedSig = token.slice(dot + 1);

  let expected: Uint8Array;
  let provided: Uint8Array;
  try {
    expected = await hmac(secret, body);
    provided = base64urlDecode(providedSig);
  } catch {
    return null;
  }
  if (!timingSafeEqual(expected, provided)) return null;

  let payload: BriefApprovePayload;
  try {
    payload = JSON.parse(new TextDecoder().decode(base64urlDecode(body)));
  } catch {
    return null;
  }
  if (
    typeof payload?.n !== "number" ||
    typeof payload?.p !== "string" ||
    typeof payload?.exp !== "number" ||
    payload.exp < now
  ) {
    return null;
  }
  return payload;
}
