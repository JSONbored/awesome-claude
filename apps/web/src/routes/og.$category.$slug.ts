import { createFileRoute } from "@tanstack/react-router";
import { getEntry } from "@/data/search";

/**
 * Lightweight OG image — deterministic SVG keyed by category + slug.
 * Rendered to PNG by social cards via Cloudflare's image resizing; usable
 * as an inline preview otherwise.
 */
export const Route = createFileRoute("/og/$category/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const entry = getEntry(params.category, params.slug);
        const title = entry?.title ?? params.slug;
        const desc =
          entry?.cardDescription ?? entry?.description ?? "Curated in the HeyClaude registry.";
        const author = entry?.author ?? "HeyClaude";
        const category = entry?.category ?? params.category;

        // category color seed
        const palette: Record<string, string> = {
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
        const accent = palette[category] ?? "#c5e84e";

        const esc = (s: string) =>
          s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Word-wrap title to ~20 chars per line, 2 lines max
        const wrap = (s: string, n: number) => {
          const words = s.split(/\s+/);
          const lines: string[] = [];
          let cur = "";
          for (const w of words) {
            if ((cur + " " + w).trim().length > n) {
              if (cur) lines.push(cur);
              cur = w;
            } else cur = (cur ? cur + " " : "") + w;
          }
          if (cur) lines.push(cur);
          return lines.slice(0, 2);
        };

        const titleLines = wrap(title, 22);
        const descLines = wrap(desc, 60).slice(0, 2);

        const svg = `<?xml version="1.0" encoding="UTF-8"?>
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
      ${esc(category.toUpperCase())} · HEYCLAUDE
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
    <text x="0" y="460" font-family="DM Sans, system-ui, sans-serif" font-size="22" fill="#6b6a64">
      by <tspan font-weight="600" fill="#171614">${esc(author)}</tspan>
    </text>
  </g>
  <g transform="translate(80,540)">
    <text font-family="ui-monospace, Menlo, monospace" font-size="20" fill="#6b6a64">heyclau.de</text>
  </g>
</svg>`;

        return new Response(svg, {
          status: 200,
          headers: {
            "Content-Type": "image/svg+xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});
