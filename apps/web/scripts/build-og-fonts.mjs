// Regenerates apps/web/src/assets/fonts/space-grotesk.generated.ts from the bundled
// woff source files. The OG image renderer (Satori) needs raw font bytes available
// synchronously inside the Cloudflare Worker; embedding them as base64 in a JS module
// guarantees they ship in the bundle with no runtime fetch and no asset resolution.
//
// Run from anywhere: node apps/web/scripts/build-og-fonts.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const fontsDir = join(here, "..", "src", "assets", "fonts");

const sources = [
  { file: "space-grotesk-500.woff", export: "spaceGrotesk500Base64" },
  { file: "space-grotesk-700.woff", export: "spaceGrotesk700Base64" },
];

const header = `// AUTO-GENERATED — do not edit by hand.
// Space Grotesk (SIL OFL 1.1) latin subset, woff1 format, base64-embedded so the
// font bytes ship inside the Worker JS bundle (no runtime fetch, no asset resolution).
// Source: @fontsource/space-grotesk (space-grotesk-latin-{500,700}-normal.woff).
// Regenerate with: node apps/web/scripts/build-og-fonts.mjs
// Satori supports TTF/OTF/woff1 (NOT woff2); these are woff1.

`;

const body = sources
  .map(({ file, export: name }) => {
    const b64 = readFileSync(join(fontsDir, file)).toString("base64");
    return `export const ${name} =\n  "${b64}";\n`;
  })
  .join("\n");

const out = join(fontsDir, "space-grotesk.generated.ts");
writeFileSync(out, header + body);
console.log(`Wrote ${out} (${(header + body).length} bytes)`);
