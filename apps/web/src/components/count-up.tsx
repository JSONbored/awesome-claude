import * as React from "react";
import { useReducedMotion } from "@/lib/motion";
import { formatCompact } from "@/lib/format";

/**
 * Animated count-up for hero/stat metrics. Animates from 0 to `value`
 * over `duration` ms once on mount. Respects prefers-reduced-motion.
 */
export function CountUp({
  value,
  duration = 900,
  compact = false,
  className,
  initial,
}: {
  value: number;
  duration?: number;
  compact?: boolean;
  className?: string;
  /** SSR/first-paint fallback. Defaults to `value` so no flash of 0. */
  initial?: number;
}) {
  const reduced = useReducedMotion();
  const from = initial ?? value;
  const [n, setN] = React.useState(from);

  React.useEffect(() => {
    if (reduced || from === value) {
      setN(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const delta = value - from;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setN(Math.round(from + delta * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, reduced, from]);

  return (
    <span className={className} aria-label={value.toLocaleString()}>
      {compact ? formatCompact(n) : n.toLocaleString()}
    </span>
  );
}
