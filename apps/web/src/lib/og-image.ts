import { absoluteUrl } from "@/lib/seo";

// Per-category accent colors (shared by the entry OG route and generic OG route).
const PALETTE: Record<string, string> = {
  mcp: "#7cd17c",
  agents: "#f3b85a",
  skills: "#8aa9ff",
  rules: "#d4a5ff",
  commands: "#ff9a7a",
  hooks: "#76d7c4",
  guides: "#ffcf72",
  collections: "#b8a4ff",
  statuslines: "#9bd6f0",
};

const DEFAULT_ACCENT = "#c5e84e";

export const OG_TEXT_LIMITS = {
  eyebrow: 40,
  title: 140,
  description: 240,
  author: 80,
} as const;

export function categoryAccent(category?: string) {
  return PALETTE[category ?? ""] ?? DEFAULT_ACCENT;
}

/**
 * Clamp an accent to a strict hex color before it lands in an SVG attribute.
 * The generic /og route accepts a user-controlled `accent` query param; without
 * this, a value like `"><script>…` could break out of the `fill="…"` attribute
 * and inject markup into the SVG response. Anything that isn't a #rgb/#rrggbb/
 * #rrggbbaa hex falls back to the default.
 */
export function safeAccent(value?: string | null) {
  return value && /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value)
    ? value
    : DEFAULT_ACCENT;
}

/** Escape XML/HTML metacharacters. Exported for the server-only PNG renderer. */
export function esc(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Bound user-visible OG text before expensive SVG/PNG rendering. This keeps public
 * query-string driven cards from feeding URL-sized strings into Satori/resvg.
 */
export function clampOgText(value: string, maxChars: number) {
  return value.replace(/\s+/g, " ").trim().slice(0, maxChars);
}

/** Greedy word-wrap into at most `maxLines` lines of ~`perLine` chars. Exported for the PNG renderer. */
export function wrap(value: string, perLine: number, maxLines: number) {
  const words = value.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines: string[] = [];
  let cur = "";

  for (const word of words) {
    let remaining = word;
    while (remaining) {
      const candidate = (cur ? cur + " " : "") + remaining;
      if (candidate.length <= perLine) {
        cur = candidate;
        break;
      }

      if (cur) {
        lines.push(cur);
        cur = "";
        if (lines.length >= maxLines) return lines;
        continue;
      }

      lines.push(remaining.slice(0, perLine));
      remaining = remaining.slice(perLine);
      if (lines.length >= maxLines) return lines;
    }
  }

  if (cur && lines.length < maxLines) lines.push(cur);
  return lines;
}

/** Deterministic 1200×630 OG card SVG. Shared by /og/$category/$slug and the generic /og route. */
export function renderOgSvg(opts: {
  eyebrow?: string;
  title: string;
  description?: string;
  author?: string;
  accent?: string;
}) {
  const accent = safeAccent(opts.accent);
  const eyebrow = esc(
    clampOgText(opts.eyebrow || "HeyClaude", OG_TEXT_LIMITS.eyebrow).toUpperCase(),
  );
  const titleLines = wrap(clampOgText(opts.title, OG_TEXT_LIMITS.title), 22, 2);
  const descLines = opts.description
    ? wrap(clampOgText(opts.description, OG_TEXT_LIMITS.description), 60, 2)
    : [];

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f7f5ef"/>
      <stop offset="1" stop-color="#ece8df"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="14" height="630" fill="${accent}"/>
  <g transform="translate(80,90)">
    <text x="0" y="0" font-family="ui-monospace, Menlo, monospace" font-size="20" fill="#6b6a64" letter-spacing="2">
      ${eyebrow}
    </text>
    ${titleLines
      .map(
        (l, i) =>
          `<text x="0" y="${110 + i * 88}" font-family="Space Grotesk, system-ui, sans-serif" font-weight="700" font-size="78" fill="#171614">${esc(l)}</text>`,
      )
      .join("")}
    ${descLines
      .map(
        (l, i) =>
          `<text x="0" y="${340 + i * 38}" font-family="DM Sans, system-ui, sans-serif" font-size="28" fill="#4d4c47">${esc(l)}</text>`,
      )
      .join("")}
    ${
      opts.author
        ? `<text x="0" y="460" font-family="DM Sans, system-ui, sans-serif" font-size="22" fill="#6b6a64">by <tspan font-weight="600" fill="#171614">${esc(opts.author)}</tspan></text>`
        : ""
    }
  </g>
  <g transform="translate(80,540)">
    <text font-family="ui-monospace, Menlo, monospace" font-size="20" fill="#6b6a64">heyclau.de</text>
  </g>
</svg>`;
}

/**
 * Shield-style "Listed on HeyClaude" badge SVG, sized like shields.io badges so it
 * drops cleanly into a README. Two segments: a dark left label and an accent-tinted
 * right value (the entry's category). All caller-supplied text is escaped via esc()
 * before it lands in the markup, so an entry-derived value can't break out of the SVG.
 */
export function renderBadgeSvg(opts: { label?: string; value: string; accent?: string }) {
  const label = (opts.label ?? "Listed on HeyClaude").trim() || "Listed on HeyClaude";
  const value = opts.value.trim() || "registry";
  const accent = safeAccent(opts.accent);

  // Approximate Verdana 11px advance width (≈6.4px/char) + horizontal padding per segment.
  const charWidth = 6.4;
  const pad = 12;
  const height = 20;
  const labelWidth = Math.ceil(label.length * charWidth) + pad * 2;
  const valueWidth = Math.ceil(value.length * charWidth) + pad * 2;
  const total = labelWidth + valueWidth;
  // ×10 because text is rendered at scale(0.1) for crisp sub-pixel positioning (shields.io trick).
  const labelMid = (labelWidth / 2) * 10;
  const valueMid = (labelWidth + valueWidth / 2) * 10;
  const labelTextLen = (labelWidth - pad * 2) * 10;
  const valueTextLen = (valueWidth - pad * 2) * 10;
  const safeLabel = esc(label);
  const safeValue = esc(value);

  // Escaped text only ever lands in element content (never an attribute), so esc()'s
  // <, >, & coverage is sufficient — a raw quote can't break out of an attribute.
  // The <title> element supplies the accessible name for role="img".
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${height}" viewBox="0 0 ${total} ${height}" role="img">
  <title>${safeLabel}: ${safeValue}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#fff" stop-opacity=".7"/>
    <stop offset=".1" stop-color="#aaa" stop-opacity=".1"/>
    <stop offset=".9" stop-color="#000" stop-opacity=".3"/>
    <stop offset="1" stop-color="#000" stop-opacity=".5"/>
  </linearGradient>
  <clipPath id="r"><rect width="${total}" height="${height}" rx="3"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="${height}" fill="#171614"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="${height}" fill="${accent}"/>
    <rect width="${total}" height="${height}" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="110" transform="scale(.1)">
    <text x="${labelMid}" y="150" fill="#000" fill-opacity=".25" textLength="${labelTextLen}">${safeLabel}</text>
    <text x="${labelMid}" y="140" textLength="${labelTextLen}">${safeLabel}</text>
    <text x="${valueMid}" y="150" fill="#000" fill-opacity=".25" textLength="${valueTextLen}">${safeValue}</text>
    <text x="${valueMid}" y="140" fill="#171614" textLength="${valueTextLen}">${safeValue}</text>
  </g>
</svg>`;
}

/** OG card dimensions, exported so routes can advertise them in og:image:width/height. */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** Absolute og:image URL pointing at the crawlable /og generator (NOT /api/og, which is disallowed). */
export function ogImageUrl(opts: {
  title: string;
  eyebrow?: string;
  description?: string;
  accent?: string;
}) {
  const params = new URLSearchParams({ title: opts.title });
  if (opts.eyebrow) params.set("eyebrow", opts.eyebrow);
  if (opts.description) params.set("description", opts.description);
  if (opts.accent) params.set("accent", opts.accent);
  return absoluteUrl(`/og?${params.toString()}`);
}
