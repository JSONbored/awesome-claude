#!/usr/bin/env node
// Renders the "Gittensor impact" README card for this repo: a dark-themed SVG
// with 12-week sparklines (merged PRs, contributors, lines changed) and a
// meter (emission share), styled with this repo's own brand tokens rather
// than a generic third-party template. Replaces matthewevans/gittensor-impact-action's
// rendering (its per-repo data-fetch approach inspired this, but the visual
// design here is our own, matching apps/web/src/styles.css).
//
// Usage: node scripts/gittensor-impact-card.mjs <owner/repo> <out-file.svg>

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const WEEKS = 12;
const THEME = {
  cardBg: "#121212",
  fg: "#f3f2ee",
  muted: "#a6a49f",
  accent: "#e8fb00",
  accentTrack: "#3a3d0a",
  border: "#292929",
  radius: 28,
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const repoIconPath = path.join(repoRoot, "apps/web/public/favicon.svg");

function compact(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "k";
  return String(n);
}

// api.gittensor.io values (and the repo name) end up as SVG <text> content,
// so escape XML special chars rather than trust they're clean numbers/strings.
function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "gittensor-impact-card/1.0" },
  });
  if (!res.ok) throw new Error(`fetch failed: ${url} (${res.status})`);
  return res.json();
}

function bucketWeekly(prs, now) {
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const bucketStart = new Date(now.getTime() - WEEKS * weekMs);
  const prBuckets = Array(WEEKS).fill(0);
  const locBuckets = Array(WEEKS).fill(0);
  const seenByBucket = Array.from({ length: WEEKS }, () => new Set());
  const contributorBuckets = Array(WEEKS).fill(0);

  for (const pr of prs) {
    const t = new Date(pr.mergedAt);
    if (t < bucketStart || t > now) continue;
    const idx = Math.min(WEEKS - 1, Math.floor((t - bucketStart) / weekMs));
    prBuckets[idx] += 1;
    locBuckets[idx] += (pr.additions || 0) + (pr.deletions || 0);
    seenByBucket[idx].add(pr.author);
  }

  const seenSoFar = new Set();
  for (let i = 0; i < WEEKS; i++) {
    for (const a of seenByBucket[i]) seenSoFar.add(a);
    contributorBuckets[i] = seenSoFar.size;
  }
  return { prBuckets, locBuckets, contributorBuckets };
}

function sparkline(x, y, w, h, values, mutedColor, accentColor, cardBg) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const n = values.length;
  const stepX = w / (n - 1);
  const pts = values.map((v, i) => [
    x + i * stepX,
    y + h - ((v - min) / range) * h,
  ]);
  const svgPath = pts
    .map(
      ([px, py], i) =>
        `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`,
    )
    .join(" ");
  const [lastX, lastY] = pts[pts.length - 1];
  return `
<path d="${svgPath}" fill="none" stroke="${mutedColor}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="${lastX.toFixed(1)}" cy="${lastY.toFixed(1)}" r="6" fill="${cardBg}"/>
<circle cx="${lastX.toFixed(1)}" cy="${lastY.toFixed(1)}" r="4" fill="${accentColor}"/>`;
}

function meter(x, y, w, h, value, max, accentColor, trackColor) {
  const fillW = Math.max(h, Math.min(value / max, 1) * w);
  return `
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${trackColor}"/>
<rect x="${x}" y="${y}" width="${fillW.toFixed(1)}" height="${h}" rx="${h / 2}" fill="${accentColor}"/>`;
}

function render({ repo, impact, buckets, gtLogoB64, repoIconB64 }) {
  const { cardBg, fg, muted, accent, accentTrack, border, radius } = THEME;
  const W = 1200,
    H = 420;
  const pad = 56;
  const cols = 4;
  const colW = (W - 2 * pad) / cols;
  const font = "'DM Sans', ui-sans-serif, system-ui, -apple-system, sans-serif";
  const displayFont =
    "'Space Grotesk', ui-sans-serif, system-ui, -apple-system, sans-serif";
  const sparkW = colW - 40;
  const sparkH = 56;
  const sparkY = 150;

  const stats = [
    {
      type: "sparkline",
      series: buckets.prBuckets,
      value: impact.totalPRs.toLocaleString(),
      label: "merged PRs",
    },
    {
      type: "sparkline",
      series: buckets.contributorBuckets,
      value: String(impact.totalContributors),
      label: "contributors",
    },
    {
      type: "sparkline",
      series: buckets.locBuckets,
      value: compact(impact.totalLinesChanged),
      label: "lines changed",
    },
    {
      type: "meter",
      raw: impact.emissionShare * 100,
      max: 100,
      value: `${(impact.emissionShare * 100).toFixed(1)}%`,
      label: "emission share",
    },
  ];

  let statsSvg = "";
  stats.forEach((s, i) => {
    const x = pad + i * colW;
    if (s.type === "meter") {
      statsSvg += meter(
        x,
        sparkY + sparkH / 2 - 7,
        sparkW,
        14,
        s.raw,
        s.max,
        accent,
        accentTrack,
      );
    } else {
      statsSvg += sparkline(
        x,
        sparkY,
        sparkW,
        sparkH,
        s.series,
        muted,
        accent,
        cardBg,
      );
    }
    statsSvg += `
<text x="${x}" y="${sparkY + sparkH + 78}" font-family="${font}" font-size="60" font-weight="700" fill="${fg}">${escapeXml(s.value)}</text>
<text x="${x}" y="${sparkY + sparkH + 112}" font-family="${font}" font-size="21" font-weight="500" fill="${muted}">${escapeXml(s.label)}</text>`;
  });

  const logoW = 48,
    logoH = 48 / (708 / 567); // gittensor.io/gt-logo.svg aspect ratio
  const repoIconSize = 26;
  const repoIconX = W - pad - repoIconSize;
  const repoIconY = 396 - 14 - (repoIconSize - 16);
  const repoTextX = repoIconX - 10;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="210" viewBox="0 0 ${W} ${H}" role="img">
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${radius}" fill="${cardBg}" stroke="${border}" stroke-width="1"/>
<image href="data:image/svg+xml;base64,${gtLogoB64}" x="${pad}" y="${(80 - logoH / 2 - 4).toFixed(1)}" width="${logoW}" height="${logoH.toFixed(1)}"/>
<text x="${pad + logoW + 14}" y="80" font-family="${displayFont}" font-size="22" font-weight="500" letter-spacing="0.08em" fill="${muted}">GITTENSOR IMPACT</text>
<line x1="${pad}" y1="124" x2="${W - pad}" y2="124" stroke="${border}" stroke-width="1"/>
${statsSvg}
<text x="${pad}" y="396" font-family="${font}" font-size="19" font-weight="400" fill="${muted}">Updated weekly &#183; gittensor.io</text>
<image href="data:image/svg+xml;base64,${repoIconB64}" x="${repoIconX}" y="${repoIconY}" width="${repoIconSize}" height="${repoIconSize}"/>
<text x="${repoTextX}" y="396" font-family="${displayFont}" font-size="20" font-weight="500" letter-spacing="-0.01em" fill="${fg}" text-anchor="end">${escapeXml(repo)}</text>
</svg>`;
}

async function main() {
  const [repo, outFile] = process.argv.slice(2);
  if (!repo || !outFile) {
    console.error(
      "Usage: node scripts/gittensor-impact-card.mjs <owner/repo> <out-file.svg>",
    );
    process.exit(1);
  }
  const encoded = encodeURIComponent(repo);
  const [impact, prs, gtLogoSvg] = await Promise.all([
    fetchJson(`https://api.gittensor.io/repos/${encoded}/impact`),
    fetchJson(`https://api.gittensor.io/repos/${encoded}/prs`),
    fetch("https://gittensor.io/gt-logo.svg").then((r) => r.text()),
  ]);
  const buckets = bucketWeekly(prs, new Date());
  const gtLogoB64 = Buffer.from(gtLogoSvg).toString("base64");
  const repoIconB64 = Buffer.from(readFileSync(repoIconPath)).toString(
    "base64",
  );

  const svg = render({ repo, impact, buckets, gtLogoB64, repoIconB64 });
  writeFileSync(outFile, svg);
  console.log(`Wrote ${outFile} (${svg.length} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
