import {
  spaceGrotesk500Base64,
  spaceGrotesk700Base64,
} from "@/assets/fonts/space-grotesk.generated";

/**
 * Decode a base64 string into an ArrayBuffer. Uses `atob` (available in workerd and
 * the browser) and avoids `Buffer`/`node:buffer`, which Vite cannot reliably bundle
 * for the Cloudflare Worker target.
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

type SatoriFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 500 | 600 | 700;
  style: "normal";
};

let cachedFonts: SatoriFont[] | null = null;

/**
 * Font set for the OG card, decoded once per isolate. Satori cannot resolve CSS
 * font-family names on its own — it needs the raw font bytes. We bundle a small
 * Space Grotesk woff1 subset (medium + bold) and reuse it for the whole card.
 * The bytes are embedded as base64 in the bundle so there is no runtime fetch.
 */
export function getOgFonts(): SatoriFont[] {
  if (cachedFonts) return cachedFonts;
  cachedFonts = [
    {
      name: "Space Grotesk",
      data: base64ToArrayBuffer(spaceGrotesk500Base64),
      weight: 500,
      style: "normal",
    },
    {
      name: "Space Grotesk",
      data: base64ToArrayBuffer(spaceGrotesk700Base64),
      weight: 700,
      style: "normal",
    },
  ];
  return cachedFonts;
}
