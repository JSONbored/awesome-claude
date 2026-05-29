import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Tiny inline-SVG sparkline. No chart library required.
 * Renders a smooth polyline across the supplied data with an optional
 * area fill underneath. Values are scaled to the visible box.
 */
export function Sparkline({
  data,
  width = 96,
  height = 24,
  className,
  strokeClassName = "stroke-ink",
  fillClassName = "fill-ink/10",
  area = true,
  ariaLabel,
}: {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  strokeClassName?: string;
  fillClassName?: string;
  area?: boolean;
  ariaLabel?: string;
}) {
  if (!data || data.length === 0) {
    return <div className={cn("inline-block", className)} style={{ width, height }} aria-hidden />;
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = data.length > 1 ? width / (data.length - 1) : width;
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 2) - 1;
    return [x, y] as const;
  });
  const linePath = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role={ariaLabel ? "img" : "presentation"}
      aria-label={ariaLabel}
      className={cn("overflow-visible", className)}
    >
      {area && <path d={areaPath} className={fillClassName} strokeWidth={0} />}
      <path
        d={linePath}
        className={strokeClassName}
        fill="none"
        strokeWidth={1.25}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
