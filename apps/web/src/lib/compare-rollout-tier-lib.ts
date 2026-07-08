// Pure readiness-tier -> CSS class mapping for the compare rollout readiness
// panel, split out so the mapping can be unit-tested without React.

/** Border/background/text classes for a rollout-readiness tier. */
export function tierClass(tier: "ready" | "review" | "hold"): string {
  if (tier === "ready") return "border-trust-trusted/30 bg-trust-trusted/5 text-trust-trusted";
  if (tier === "hold") return "border-trust-blocked/30 bg-trust-blocked/5 text-trust-blocked";
  return "border-amber-500/30 bg-amber-500/5 text-amber-900";
}
