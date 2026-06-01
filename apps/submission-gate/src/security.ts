const encoder = new TextEncoder();

function bytesToHex(bytes: ArrayBuffer) {
  return [...new Uint8Array(bytes)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export function base64UrlEncode(value: string | ArrayBuffer) {
  const bytes =
    typeof value === "string" ? encoder.encode(value) : new Uint8Array(value);
  return bytesToBase64(bytes)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function base64UrlDecode(value: string) {
  const padded = `${value.replace(/-/g, "+").replace(/_/g, "/")}${"=".repeat(
    (4 - (value.length % 4)) % 4,
  )}`;
  return base64ToBytes(padded);
}

export async function sha256Hex(value: string) {
  return bytesToHex(
    await crypto.subtle.digest("SHA-256", encoder.encode(value)),
  );
}

export async function hmacSha256Hex(secret: string, payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return bytesToHex(
    await crypto.subtle.sign("HMAC", key, encoder.encode(payload)),
  );
}

export function timingSafeEqual(left: string, right: string) {
  const maxLength = Math.max(left.length, right.length);
  let diff = left.length === right.length ? 0 : 1;
  for (let index = 0; index < maxLength; index += 1) {
    diff |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return diff === 0;
}

export async function verifyGitHubWebhookSignature(params: {
  secret: string;
  payload: string;
  signatureHeader: string | null;
}) {
  if (!params.secret || !params.signatureHeader?.startsWith("sha256="))
    return false;
  const expected = `sha256=${await hmacSha256Hex(params.secret, params.payload)}`;
  return timingSafeEqual(expected, params.signatureHeader);
}

export async function signInternalPayload(secret: string, payload: string) {
  return `sha256=${await hmacSha256Hex(secret, payload)}`;
}

export async function verifyInternalSignature(params: {
  secret: string;
  payload: string;
  signatureHeader: string | null;
}) {
  if (!params.secret || !params.signatureHeader?.startsWith("sha256="))
    return false;
  const expected = await signInternalPayload(params.secret, params.payload);
  return timingSafeEqual(expected, params.signatureHeader);
}

export function randomToken(bytes = 32) {
  const data = new Uint8Array(bytes);
  crypto.getRandomValues(data);
  return base64UrlEncode(data.buffer);
}

async function aesKey(secret: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  return crypto.subtle.importKey("raw", digest, { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt",
  ]);
}

export async function encryptText(secret: string, plaintext: string) {
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    await aesKey(secret),
    encoder.encode(plaintext),
  );
  return `${base64UrlEncode(iv.buffer)}.${base64UrlEncode(ciphertext)}`;
}

export async function decryptText(secret: string, encrypted: string) {
  const [ivText, ciphertextText] = encrypted.split(".");
  if (!ivText || !ciphertextText) throw new Error("Invalid encrypted payload.");
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64UrlDecode(ivText) },
    await aesKey(secret),
    base64UrlDecode(ciphertextText),
  );
  return new TextDecoder().decode(plaintext);
}
