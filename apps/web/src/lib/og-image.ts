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

function esc(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wrap(value: string, perLine: number, maxLines: number) {
  const words = value.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const word of words) {
    if ((cur + " " + word).trim().length > perLine) {
      if (cur) lines.push(cur);
      cur = word;
    } else cur = (cur ? cur + " " : "") + word;
  }
  if (cur) lines.push(cur);
  return lines.slice(0, maxLines);
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
  const eyebrow = esc((opts.eyebrow || "HeyClaude").toUpperCase());
  const titleLines = wrap(opts.title, 22, 2);
  const descLines = opts.description ? wrap(opts.description, 60, 2) : [];

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
