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
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);
  const subtle = crypto.subtle as SubtleCrypto & {
    timingSafeEqual?: (left: Uint8Array, right: Uint8Array) => boolean;
  };
  if (
    leftBytes.length === rightBytes.length &&
    typeof subtle.timingSafeEqual === "function"
  ) {
    return subtle.timingSafeEqual(leftBytes, rightBytes);
  }
  const maxLength = Math.max(leftBytes.length, rightBytes.length);
  let diff = leftBytes.length === rightBytes.length ? 0 : 1;
  for (let index = 0; index < maxLength; index += 1) {
    diff |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
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

async function aesKey(secret: string, salt: Uint8Array) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    "HKDF",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt,
      info: encoder.encode("heyclaude-submission-gate:user-token:v1"),
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptText(secret: string, plaintext: string) {
  const salt = new Uint8Array(16);
  const iv = new Uint8Array(12);
  crypto.getRandomValues(salt);
  crypto.getRandomValues(iv);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    await aesKey(secret, salt),
    encoder.encode(plaintext),
  );
  return `${base64UrlEncode(salt.buffer)}.${base64UrlEncode(iv.buffer)}.${base64UrlEncode(ciphertext)}`;
}

export async function decryptText(secret: string, encrypted: string) {
  const parts = encrypted.split(".");
  if (parts.length !== 3) throw new Error("Invalid encrypted payload.");
  const [saltText, ivText, ciphertextText] = parts;
  if (!saltText || !ivText || !ciphertextText)
    throw new Error("Invalid encrypted payload.");
  try {
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: base64UrlDecode(ivText) },
      await aesKey(secret, base64UrlDecode(saltText)),
      base64UrlDecode(ciphertextText),
    );
    return new TextDecoder().decode(plaintext);
  } catch {
    throw new Error("Invalid encrypted payload.");
  }
}
