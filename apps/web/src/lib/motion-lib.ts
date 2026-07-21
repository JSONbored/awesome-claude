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
