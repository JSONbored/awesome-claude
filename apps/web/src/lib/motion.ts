import * as React from "react";

/** Shared motion tokens. Respect prefers-reduced-motion. */
export const MOTION = {
  duration: {
    fast: 120,
    base: 180,
    slow: 240,
  },
  ease: {
    standard: "cubic-bezier(0.2, 0.7, 0.2, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
} as const;

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);
  return reduced;
}
