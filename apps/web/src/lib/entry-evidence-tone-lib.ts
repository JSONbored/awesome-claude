// Pure tone/score -> CSS class mappings for the entry evidence-readiness matrix,
// split out so the mappings can be unit-tested without React.

/** Border/background/text classes for a risk score (higher = worse). */
export function riskTone(score: number): string {
  if (score >= 60) return "border-trust-blocked/40 bg-trust-blocked/10 text-trust-blocked";
  if (score >= 30) return "border-amber-500/40 bg-amber-500/10 text-amber-900";
  return "border-trust-trusted/40 bg-trust-trusted/10 text-trust-trusted";
}

/** Border/background classes for a matrix cell's completeness tone. */
export function cellToneClass(tone: "complete" | "warning" | "critical"): string {
  if (tone === "critical") return "border-trust-blocked/35 bg-trust-blocked/5";
  if (tone === "warning") return "border-amber-500/35 bg-amber-500/5";
  return "border-border bg-background";
}
