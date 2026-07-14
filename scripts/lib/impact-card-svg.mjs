// Pure SVG-geometry builders behind scripts/gittensor-impact-card.mjs: the
// sparkline path/marker and the meter track/fill rectangles. Split out from the
// fetch/render script so the coordinate math and emitted markup can be
// unit-tested deterministically.

/**
 * Build an SVG sparkline (a polyline plus an end-point marker) for `values`
 * within the box at (x, y) of size w x h. Values are min/max normalized with a
 * floor of max>=1 / min<=0 so a flat or empty-ish series still renders.
 */
export function sparkline(x, y, w, h, values, mutedColor, accentColor, cardBg) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const n = values.length;
  if (n === 0) return "";
  // With a single point there is no horizontal step; keep stepX at 0 so the
  // point lands at x instead of x + 0 * (w / 0) === NaN.
  const stepX = n > 1 ? w / (n - 1) : 0;
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

/**
 * Build an SVG horizontal meter: a full-width track plus a fill whose width is
 * value/max of w, clamped to [h, w] so the rounded cap never collapses.
 */
export function meter(x, y, w, h, value, max, accentColor, trackColor) {
  const fillW = Math.max(h, Math.min(value / max, 1) * w);
  return `
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${trackColor}"/>
<rect x="${x}" y="${y}" width="${fillW.toFixed(1)}" height="${h}" rx="${h / 2}" fill="${accentColor}"/>`;
}
